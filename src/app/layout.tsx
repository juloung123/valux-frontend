import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Web3Provider from "@/providers/Web3Provider";
import ErrorBoundary from "@/components/ErrorBoundary";
import ApiIntegrationProvider from "@/components/ApiIntegrationProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Valux.finance - DeFi Automation Platform",
  description: "The most user-friendly DeFi automation platform for seamless profit distribution and yield optimization on Arbitrum.",
  keywords: "DeFi, Yield Farming, Automation, Profit Distribution, Arbitrum, Web3",
  authors: [{ name: "Valux Finance Team" }],
  openGraph: {
    title: "Valux.finance - DeFi Automation Platform",
    description: "Automate your DeFi profits with our intuitive rule engine and vault system.",
    type: "website",
    siteName: "Valux.finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valux.finance - DeFi Automation Platform",
    description: "Automate your DeFi profits with our intuitive rule engine and vault system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Web3Provider>
            <ApiIntegrationProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ApiIntegrationProvider>
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
