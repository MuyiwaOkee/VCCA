import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashbaord",
};

export default function RootLayout({
  children,
  notifications
}: Readonly<{
  children: React.ReactNode,
  notifications: React.ReactNode
}>) {
  return (
    <div className="flex justify-center h-full">
      <div className="w-[1200px] h-full flex gap-6 mt-4">
        <section className="w-[384px] inline-flex flex-col justify-start items-end">
          {notifications}
        </section>
        <section className="w-full inline-flex flex-col justify-start items-start gap-6">
          {children}
        </section>
      </div>
    </div>
  );
}
