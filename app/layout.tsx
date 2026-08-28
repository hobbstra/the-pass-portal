import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Pass — Restaurant & Bakery Operations Platform",
  description:
    "The Pass is an operations platform for restaurants and bakeries — scheduling, inventory, checklists, wholesale, recipes, and payroll in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
