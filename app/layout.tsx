import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campaign Analytics Dashboard",
  description: "Real-time analytics dashboard for monitoring Heyreach and Instantly campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
