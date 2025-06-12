import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
        {children}
        <Link href='/terms-conditions' className="absolute bottom-20 text-black w-full text-center text-xs font-semibold underline leading-none">Terms and conditions</Link>
    </div>
  );
}
