import React from "react";

export default function RootLayout({
  children,
  notification,
  list
}: Readonly<{
  children: React.ReactNode;
  notification: React.ReactNode;
  list: React.ReactNode;
}>) {
  return (
    <div className="relative h-full">
        {notification}
        <section className="w-full flex flex-col justify-center items-center relative">
          {children}
          {list}
        </section>
    </div>
  );
}
