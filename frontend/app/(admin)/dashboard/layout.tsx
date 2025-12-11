"use client";

import { getRoleFromToken } from "@/app/lib/getRoleFromToken";
import { useState } from "react";

export default function DashboardLayout({
  groupsUsers,
  groupAdmins,
  groupNotes,
}: {
  groupsUsers: React.ReactNode;
  groupAdmins: React.ReactNode;
  groupNotes: React.ReactNode;
}) {
  const [role] = useState(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return getRoleFromToken(token);
  });

  console.log({ role });

  return (
    <div className="flex flex-col gap-6">
      {role === "ROOT_ADMIN" || <div>{groupAdmins}</div>}
      <div>{groupsUsers}</div>
      <div>{groupNotes}</div>
    </div>
  );
}
