import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Tracker",
  description: "A 16-week roadmap from a 2-year Node.js/Angular developer to an internationally employable full-stack engineer: NestJS, PostgreSQL, shipping, interviews and English, with your progress saved.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
