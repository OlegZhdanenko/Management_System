import "./globals.css";
import { Providers } from "./providers";
import CustomThemeProvider from "./providers/theme-provider";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./components/Sidebar"));

export const metadata = {
  title: "Management System",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <CustomThemeProvider>
          <Providers>
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {children}
            </main>
          </Providers>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
