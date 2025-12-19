"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import { useLogout } from "../hooks/auth/useLogout";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function Sidebar() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const logout = useLogout();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <aside className=" w-72 h-full border-r p-6 flex flex-col bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Management system</h2>

      {currentUser && (
        <nav className="flex flex-col gap-2 mb-6">
          <Toaster position="top-right" />
          <Link href="/dashboard">Dashboard</Link>
          {currentUser?.role === "ROOT_ADMIN" && (
            <Link href="/group">Create group</Link>
          )}
          {currentUser?.role === "USER" || (
            <Link href="/user">Create user</Link>
          )}
        </nav>
      )}

      <div className="mt-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : currentUser ? (
          <div className="flex flex-col gap-2">
            <div className="text-sm">Signed in as</div>
            <div className="font-medium">{currentUser.email}</div>
            <button className="mt-2 bg-red-500 text-white p-2" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link href={"/"}>Please login</Link>
        )}
      </div>
    </aside>
  );
}
