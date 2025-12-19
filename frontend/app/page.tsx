import AuthPage from "./components/auth/AuthPage";
import { Toaster } from "react-hot-toast";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Managment system</h1>
      <AuthPage />
      <Toaster position="top-right" />
    </div>
  );
}
