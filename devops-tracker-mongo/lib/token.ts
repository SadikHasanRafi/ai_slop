// Edge-safe JWT helpers (used by middleware and by server code).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "devops_session";
export const SESSION_DAYS = 30;

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or shorter than 16 characters.");
  }
  return new TextEncoder().encode(secret);
}

export type Session = { userId: string; email: string };

export async function signSession(s: Session): Promise<string> {
  return new SignJWT({ email: s.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
