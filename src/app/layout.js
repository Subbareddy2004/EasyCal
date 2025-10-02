import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EasyCal - Simple Financial Calculators for Indians",
  description: "EasyCal - Easy-to-use financial planning tools for SIP, EMI, PPF, Tax, FD, and Retirement calculations. Trusted by 10,000+ users. Free, accurate, and designed for Indian investors.",
  keywords: "SIP calculator, EMI calculator, PPF calculator, tax calculator, financial planning, investment calculator, retirement planning, India, EasyCal",
  authors: [{ name: "EasyCal Team" }],
  creator: "EasyCal",
  publisher: "EasyCal",
  robots: "index, follow",
  openGraph: {
    title: "EasyCal - Simple Financial Calculators",
    description: "Easy-to-use financial planning tools for Indian investors. Calculate SIP, EMI, PPF, Tax, and more.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyCal - Simple Financial Calculators",
    description: "Easy-to-use financial planning tools for Indian investors.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
