import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jinhyeok Kim | Blockchain & Backend Developer",
  description: "Portfolio of Jinhyeok Kim",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
