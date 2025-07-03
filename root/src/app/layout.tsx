import type { Metadata } from "next";
// Import the styles:
import '@visa/nova-styles/styles.css';
// Import your desired theme:
import '@visa/nova-styles/themes/visa-light/index.css';
import "./globals.css";
// Compontents
import DefaultFooter from "@/components/DefaultFooter";
// main font
import { Noto_Sans } from 'next/font/google'
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Providers from "./provide";


export const metadata: Metadata = {
  title: {
    default: "VCCA",
    template: "%s | VCCA  - Muyiwa Oke"
  },
  description: "Built to resemble VISA's internal tools and VCA service. Developed by Muyiwa Oke",
};
 
const noto_Sans = Noto_Sans({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={noto_Sans.className}>
      <body>
          <Providers>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </Providers>
        <DefaultFooter/>
      </body>
    </html>
  );
}
