import "@fontsource/inter";
import "@fontsource/instrument-sans";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/assets/vendors/fontawesome/css/all.min.css";
import "@/assets/vendors/commerce-icons/style.css";
import "@/assets/css/sadamata.css";
import "@/assets/css/sadamata-custom.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Sadamata",
  description: "Sadamata",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div className='page-wrapper'>
          <Toaster />

          {children}
        </div>
      </body>
    </html>
  );
}
