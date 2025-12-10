import LoginForm from "./components/auth/loginForm";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <h1>Managment system</h1>
      <LoginForm />
    </div>
  );
}
