import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashbaord",
};

export default function RootLayout({
  children,
  notifications,
  trends
}: Readonly<{
  children: React.ReactNode,
  notifications: React.ReactNode,
  trends: React.ReactNode
}>) {
  return (
    <div className="flex justify-center">
      <div className="w-[1200px] h-full relative mt-4">
        <section className="w-[384px] inline-flex flex-col justify-start items-end">
          {notifications}
        </section>
        <section className="self-stretch inline-flex flex-col justify-start items-center gap-6">
          {children}
          {trends}
        </section>
      </div>
    </div>
  );
}
