import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SmartPriceBD - Hardware Price Aggregator",
  description: "Compare real-time tech prices in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.className} bg-[#e6e7ee] text-[#31344b] antialiased selection:bg-[#2d4cc8]/20 selection:text-[#2d4cc8]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
