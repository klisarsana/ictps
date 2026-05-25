import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi",
  description: "Masuk atau daftar ke sistem ICTPS.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {children}
    </div>
  );
}
