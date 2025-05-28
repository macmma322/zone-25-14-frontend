// zone-25-14-frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Anton, Outfit, Dancing_Script, Pacifico } from "next/font/google";

import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import TabFocusHandler from "@/components/utils/TabFocusHandler"; // We'll create this

config.autoAddCss = false;

import Providers from "@/components/common/Providers"; // We'll create this

export const metadata: Metadata = {
  title: {
    default: "Zone 25-14",
    template: "%s | Zone 25-14",
  },
  description: "Where loyalty and rebellion meet.",
  icons: {
    icon: "/icons/favicon.ico", // standard browser tab icon
    shortcut: "/icons/favicon.png", // PNG fallback
    apple: "/icons/android-chrome-192x192.png", // iOS add-to-home
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${anton.variable} ${dancingScript.variable} ${pacifico.variable} m-0 p-0 overflow-hidden font-sans bg-gradient-to-br from-[#0f0f0f] to-[#1b1b1b] text-white`}
      >
        <TabFocusHandler />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
