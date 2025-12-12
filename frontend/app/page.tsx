import LoginForm from "./components/auth/loginForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Managment system</h1>
      <LoginForm />
    </div>
  );
}
