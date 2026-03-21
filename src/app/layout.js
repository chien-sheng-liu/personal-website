
import "./globals.css";
import { ThemeProvider } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import LangDetect from "@/components/LangDetect";

export const metadata = {
  title: {
    template: '%s | Morris Liu · AI × 策略',
    default: 'Morris Liu · AI × 策略',
  },
  description: "Morris Liu — 資料科學家與 AI 策略師，將數據轉化為清晰敘事與商業價值。",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <ThemeProvider>
          <LangDetect />
          <CursorGlow />
          <Navbar />
          <main className="relative z-0 pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
