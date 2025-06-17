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
      <div className="w-[1200px] h-full relative">
        <section className="self-stretch inline-flex flex-col justify-start items-end">
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
