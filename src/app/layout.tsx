import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Letterhead from "@/components/Letterhead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MHT-CET & JEE Predictor | MIT College of Railway Engineering & Research",
  description:
    "Official MHT-CET and JEE rank predictor tool for students seeking admission to MIT College of Railway Engineering & Research, Barshi. Find your predicted college and branch instantly.",
  keywords: "MHT-CET predictor, JEE predictor, MIT CORER, MIT Barshi, college predictor, Maharashtra engineering admission",
  openGraph: {
    title: "MHT-CET & JEE Predictor | MIT CORER Barshi",
    description: "Find your predicted college & branch based on your MHT-CET or JEE score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <Letterhead />
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 200px)" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
