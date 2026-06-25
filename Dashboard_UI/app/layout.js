import { Fraunces, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import N8nChat from "@/components/N8nChat";
import { CartProvider } from "@/context/CartContext";
import { GoogleTagManager } from '@next/third-parties/google';
import GTMDebugPanel from "@/components/GTMDebugPanel";
import ProgressBarProvider from "@/components/ProgressBarProvider";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Amaira Fruits | Premium Handpicked Fruits in Bangladesh",
  description: "Amaira Fruits is an Agritech fresh fruit chain delivering premium, safe, and handpicked fruits from farm to table.",
  keywords: "fruits, fresh fruits, organic fruits, mango, bd fruits, online fruits shop, dhaka delivery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable} ${hindSiliguri.variable}`}>
      <body>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        <ProgressBarProvider>
          <CartProvider>
            <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <N8nChat />
          {/* Floating WhatsApp Support Icon */}
          <a 
            href="https://wa.me/8801740414134?text=Hello%20Amaira%20Fruits!%20I'd%20like%20to%20know%20more%20about%20your%20products." 
            className="floating-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
          >
            💬
          </a>
          <GTMDebugPanel />
        </CartProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
