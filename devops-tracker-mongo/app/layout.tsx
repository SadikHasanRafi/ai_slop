import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOps Tracker",
  description: "A step-by-step roadmap from Node.js developer to DevOps engineer: Linux, Docker, CI/CD, cloud, Kubernetes and observability, with your progress saved.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
