import { Navbar } from "@/components/Navbar";
import React from "react";

export default function RootLayout({
  children,
  logout
}: Readonly<{
  children: React.ReactNode;
  logout: React.ReactNode
}>) {
  return (
    <div className="relative h-full">
        {logout}
        <Navbar />
        {children}
    </div>
  );
}
