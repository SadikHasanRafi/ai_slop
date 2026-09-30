"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { MongoServerError } from "mongodb";
import { collections } from "@/lib/db";
import { endSession, startSession } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function back(mode: "signin" | "signup", error: string, email = ""): never {
  const q = new URLSearchParams({ mode, error });
  if (email) q.set("email", email);
  redirect(`/login?${q.toString()}`);
}

export async function signUp(formData: FormData) {
  const { email, password } = read(formData);
  if (!EMAIL_RE.test(email)) back("signup", "Enter a valid email address.", email);
  if (password.length < 6) back("signup", "Use a password of at least 6 characters.", email);
  if (password.length > 72) back("signup", "Use a password of 72 characters or fewer.", email);

  const { users } = await collections();
  const passwordHash = await bcrypt.hash(password, 10);

  let userId: string;
  try {
    const res = await users.insertOne({ email, passwordHash, createdAt: new Date() });
    userId = res.insertedId.toHexString();
  } catch (e) {
    if (e instanceof MongoServerError && e.code === 11000) {
      back("signin", "That email already has an account. Sign in instead.", email);
    }
    throw e;
  }

  await startSession({ userId, email });
  redirect("/");
}

export async function signIn(formData: FormData) {
  const { email, password } = read(formData);
  if (!email || !password) back("signin", "Enter your email and password.", email);

  const { users } = await collections();
  const user = await users.findOne({ email });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) back("signin", "Wrong email or password.", email);

  await startSession({ userId: user._id!.toHexString(), email: user.email });
  redirect("/");
}

export async function signOut() {
  endSession();
  redirect("/login");
}
