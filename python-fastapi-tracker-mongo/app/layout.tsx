import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Python FastAPI Tracker",
  description: "A step-by-step roadmap from Node.js/Express developer to job-ready Python and FastAPI backend engineer: async Python, FastAPI, PostgreSQL, testing, Docker and production, with your progress saved.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
