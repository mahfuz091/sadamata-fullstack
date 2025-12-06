import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { BlogProvider } from "@/context/BlogContext";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import "antd/dist/reset.css";
import { PressProvider } from "@/context/PressContext";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Sadamata",
  },
  description: "Sadamata Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden `}
      >
        <BlogProvider>
          <PressProvider>
            {children}
            <Toaster richColors position='bottom-right' />
          </PressProvider>
        </BlogProvider>
      </body>
    </html>
  );
}
