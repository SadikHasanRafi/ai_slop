import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { signIn, signUp } from "./actions";

export const metadata = { title: "Sign in · AI Dev Tracker" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { mode?: string; error?: string; email?: string };
}) {
  const isSignup = searchParams.mode === "signup";

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow">AI Dev Tracker</p>
        <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isSignup
            ? "Your own roadmap from Node.js to fine-tuning LLMs and vision models."
            : "Sign in to pick up where you left off."}
        </p>

        {searchParams.error && (
          <p className="alert alert-error" role="alert">{searchParams.error}</p>
        )}

        <form className="auth-form" action={isSignup ? signUp : signIn}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={searchParams.email ?? ""}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />

          <SubmitButton pendingText={isSignup ? "Creating account…" : "Signing in…"}>
            {isSignup ? "Create account" : "Sign in"}
          </SubmitButton>
        </form>

        <p className="switch">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link href={isSignup ? "/login" : "/login?mode=signup"}>
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
