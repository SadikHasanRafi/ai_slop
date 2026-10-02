"use client";

import { useFormStatus } from "react-dom";

// Submit button that shows a spinner and locks itself while its form's server action runs.
export default function SubmitButton({
  children,
  pendingText,
  className = "btn-primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending && <span className="spinner" aria-hidden="true" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
