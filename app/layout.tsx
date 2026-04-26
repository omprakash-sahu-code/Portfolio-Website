import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omprakash Sahu — Developer & Designer",
  description:
    "Portfolio of Omprakash Sahu — a Developer & Designer who values execution over perfection. Building real products with clean code and purposeful design.",
  keywords: [
    "Omprakash Sahu",
    "Developer",
    "Designer",
    "Portfolio",
    "Frontend",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "Omprakash Sahu — Developer & Designer",
    description:
      "I ship, test, and improve. Building real things and refining them through iteration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
