import React from "react";

export default function RootLayout({
  children,
  notification
}: Readonly<{
  children: React.ReactNode;
  notification: React.ReactNode;
}>) {
  return (
    <div className="relative h-full">
        {notification}
        {children}
    </div>
  );
}
