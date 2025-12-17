"use client";

import { useCurrentUser } from "@/app/hooks/auth/useCurrentUser";

export default function DashboardLayout({
  groupsUsers,
  groupAdmins,
  groupNotes,
}: {
  groupsUsers: React.ReactNode;
  groupAdmins: React.ReactNode;
  groupNotes: React.ReactNode;
}) {
  const { data: currentUser } = useCurrentUser();
  return (
    <div className="flex flex-col gap-6">
      {currentUser?.role === "ROOT_ADMIN" && <div>{groupAdmins}</div>}
      {(currentUser?.role === "ROOT_ADMIN" ||
        currentUser?.role === "ADMIN") && <div>{groupsUsers}</div>}
      {(currentUser?.role === "ROOT_ADMIN" ||
        currentUser?.role === "ADMIN" ||
        currentUser?.role === "USER") && <div>{groupNotes}</div>}
    </div>
  );
}
