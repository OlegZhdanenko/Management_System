"use client";

import { useCurrentUser } from "../hooks/useCurrentUser";

export default function DashboardPage() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Please login</div>;

  return <div>Welcome, {data.email}</div>;
}
