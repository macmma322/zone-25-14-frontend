import type { Metadata } from "next";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: 'Zone 25-14',
  description: 'Where loyalty and rebellion meet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add Google Fonts here */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600;700&family=Dancing+Script&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}