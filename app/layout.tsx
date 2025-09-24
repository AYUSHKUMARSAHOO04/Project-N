import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import {
//   ClerkProvider,
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NirveonX | AI-Powered Healthcare Platform",
    template: "%s | NirveonX",
  },
  description:
    "AI-powered healthcare platform providing personalized medical assistance, pet care, elder support, and mental wellness through innovative telehealth solutions.",
  keywords: [
    "healthcare",
    "AI healthcare",
    "telehealth",
    "mental health",
    "pet healthcare",
    "elder care",
    "medical diagnosis",
    "health assistant",
  ],
  authors: [{ name: "NirveonX Team" }],
  creator: "NirveonX",
  publisher: "NirveonX",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://nirveonx.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "NirveonX | Revolutionizing Healthcare with AI",
    description:
      "Experience the future of healthcare with AI-powered diagnostics, virtual consultations, pet care, and mental wellness support.",
    url: "https://nirveonx.com",
    siteName: "NirveonX",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1748971553/WhatsApp_Image_2025-06-03_at_22.53.50_cqli87.jpg",
        width: 1200,
        height: 630,
        alt: "NirveonX - AI-Powered Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NirveonX | AI-Powered Healthcare",
    description:
      "Personalized healthcare solutions powered by AI - from medical assistance to pet care and mental wellness.",
    creator: "@nirveonx",
    images: [
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1748971553/WhatsApp_Image_2025-06-03_at_22.53.50_cqli87.jpg",
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    
  );
}
