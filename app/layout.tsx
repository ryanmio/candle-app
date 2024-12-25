import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Candle App - Personalized Candle Experience",
  description: "Create and share personalized candles with custom scents, colors, and aromatherapy recommendations. A unique gifting experience for your loved ones.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Candle App - Personalized Candle Experience",
    description: "Create and share personalized candles with custom scents, colors, and aromatherapy recommendations.",
    type: "website",
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Candle App Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Candle App - Personalized Candle Experience",
    description: "Create and share personalized candles with custom scents, colors, and aromatherapy recommendations.",
    images: ['/twitter-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
