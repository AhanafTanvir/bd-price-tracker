import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmbientBubbles from "../components/AmbientBubbles";
import RoboCatHelper from "../components/RoboCatHelper";

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
      <body className={`${nunitoSans.className} relative min-h-screen bg-[#e6e7ee] text-[#31344b] antialiased selection:bg-[#2d4cc8]/20 selection:text-[#2d4cc8]`}>
        <AmbientBubbles />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <RoboCatHelper />
      </body>
    </html>
  );
}
