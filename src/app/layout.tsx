import type { Metadata } from "next";
import { Anton, Outfit, Dancing_Script, Pacifico } from "next/font/google";
import MainLayout from "@/components/layout/MainLayout";
import { NicheProvider } from "@/context/NicheContext";

import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script-soft",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-bold",
});

export const metadata: Metadata = {
  title: "Zone 25-14",
  description: "Where loyalty and rebellion meet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NicheProvider>
          {children}
        </NicheProvider>
      </body>
    </html>
  );
}
