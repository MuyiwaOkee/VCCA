import { Navbar } from "@/components/Navbar";
import React from "react";

export default function RootLayout({
  children,
  logout,
  notification
}: Readonly<{
  children: React.ReactNode;
  logout: React.ReactNode;
  notification: React.ReactNode
}>) {
  return (
    <div className="relative h-full">
        {logout}
        {notification}
        <Navbar />
        {children}
    </div>
  );
}
