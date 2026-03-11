import Navbar from "@/components/navbar/navbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
export const metadata = {
  title: "IT Portal",
  description: "IT Portal App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <AppRouterCacheProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="colored"
          />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
