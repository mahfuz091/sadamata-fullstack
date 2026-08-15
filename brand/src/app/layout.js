import "@fontsource/inter";
import "@fontsource/instrument-sans";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// vendored copy is Font Awesome 5.15.1, which predates fa-threads (added in 6.4.2)
// import "@/assets/vendors/fontawesome/css/all.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-country-state-city/dist/react-country-state-city.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/assets/vendors/commerce-icons/style.css";
import "@/assets/css/sadamata.css";
import "@/assets/css/sadamata-custom.css";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "Brand Sadamata",
    template: "%s || Brand Sadamata",
  },
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
