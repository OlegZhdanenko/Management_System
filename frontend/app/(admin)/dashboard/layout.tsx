"use client";

import { getRoleFromToken } from "@/app/lib/getRoleFromToken";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  groupsUsers,
  groupAdmins,
  groupNotes,
}: {
  groupsUsers: React.ReactNode;
  groupAdmins: React.ReactNode;
  groupNotes: React.ReactNode;
}) {
  const [decodeToken, setDecodeToken] = useState();
  useEffect(() => {
    if (window) {
      setDecodeToken(getRoleFromToken(localStorage.getItem("token")));
    }
  }, []);

  // const [decodeToken] = useState(() => {
  //   const token =
  //     typeof window !== "undefined" ? localStorage.getItem("token") : null;
  //   return getRoleFromToken(token);
  // });

  const role = decodeToken?.role || null;

  return (
    <div className="flex flex-col gap-6">
      {role === "ROOT_ADMIN" && <div>{groupAdmins}</div>}
      {(role === "ROOT_ADMIN" || role === "ADMIN") && <div>{groupsUsers}</div>}
      {(role === "ROOT_ADMIN" || role === "ADMIN" || role === "USER") && (
        <div>{groupNotes}</div>
      )}
    </div>
  );
}
