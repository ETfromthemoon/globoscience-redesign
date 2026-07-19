import type { Metadata } from "next";
import { Lato, Poppins, Rubik } from "next/font/google";
import SmoothScroll from "./_components/smooth-scroll";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-lato", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-poppins", display: "swap" });
const rubik = Rubik({ subsets: ["latin"], weight: ["500"], variable: "--font-rubik", display: "swap" });

export const metadata: Metadata = {
  title: "GloboScience Inc. — Regulatory Strategy & Product Development",
  description: "Architects of innovative regulatory pathways from molecule to marketplace. We transform scientific discoveries into differentiated therapeutics.",
  openGraph: { title: "GloboScience Inc.", description: "Strategic regulatory problem solver and product development consulting partner of choice.", url: "https://globoscience.com", siteName: "GloboScience Inc.", locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title: "GloboScience Inc.", description: "Strategic regulatory problem solver and product development consulting partner of choice." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${poppins.variable} ${rubik.variable}`}>
      <body className="font-body antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
