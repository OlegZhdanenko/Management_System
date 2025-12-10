import "../globals.css";
import dynamic from "next/dynamic";
import { Providers } from "../providers";

const Sidebar = dynamic(() => import("../components/Sidebar"));

export const metadata = {
  title: "Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </Providers>
  );
}
