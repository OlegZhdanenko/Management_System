"use client";

import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import { useLogout } from "../hooks/auth/useLogout";
import Link from "next/link";
import { useState } from "react";
import { getRoleFromToken } from "../lib/getRoleFromToken";

export default function Sidebar() {
  const { data, isLoading } = useCurrentUser();
  const logout = useLogout();

  const [tokenDecode] = useState(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return getRoleFromToken(token);
  });

  return (
    <aside className="w-72 p-6 border-r flex flex-col">
      <h2 className="text-xl font-bold mb-4">Management system</h2>

      {data && (
        <nav className="flex flex-col gap-2 mb-6">
          <Link href="/dashboard">Dashboard</Link>
          {tokenDecode?.role === "ROOT_ADMIN" && (
            <Link href="/group">Create group</Link>
          )}
          <Link href="/user">Create user</Link>
        </nav>
      )}

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
          <div>Please login</div>
        )}
      </div>
    </aside>
  );
}
