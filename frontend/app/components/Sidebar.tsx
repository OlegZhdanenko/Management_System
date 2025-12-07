"use client";
import LoginForm from "../components/auth/loginForm";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useLogout";

import Link from "next/link";
import { Button } from "@mui/material";
import { useThemeToggle } from "@/app/providers/theme-provider";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Sidebar() {
  const { toggle } = useThemeToggle();
  const { data, isLoading } = useCurrentUser();
  const logout = useLogout();
  console.log({ data });
  console.log({ isLoading });

  return (
    <aside className="w-72 p-6 border-r">
      <h2 className="text-xl font-bold mb-4">Managment system</h2>

      {data && (
        <nav className="flex flex-col gap-2 mb-6">
          <Link href="/">Dashboard</Link>
          <Link href="/groupinfo">Create group</Link>
          <Link href="/userinfo">Create user</Link>
        </nav>
      )}
      <Button variant="contained" onClick={toggle} startIcon={<DarkModeIcon />}>
        Toggle Theme
      </Button>
      <div className="mt-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : data ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm">Signed in as</div>
            <div className="font-medium">{data.email}</div>
            <button className="mt-2 bg-red-500 text-white p-2" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </aside>
  );
}
