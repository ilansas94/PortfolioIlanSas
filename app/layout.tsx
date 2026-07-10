import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ilan Sastiel — Portfolio",
  description: "Graphic design, identity, print, digital art, and interface work by Ilan Sastiel.",
  authors: [{ name: "Ilan Sastiel" }],
  creator: "Ilan Sastiel",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
