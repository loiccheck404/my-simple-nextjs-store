import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider, AuthProvider } from "@/contexts";
import { PaymentProvider } from "@/contexts/PaymentContext";
//import { NetworkStatus } from "@/components/LoadingSpinner";

// Using system fonts instead of Google Fonts to avoid build issues
const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: "My Store",
  icons: {
    icon: [
      { url: "/favicon2.jpeg", type: "image/jpeg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }, // fallback
    ],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <Header />
              {children}
              <Footer />
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
