"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/axios";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function GroupUsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["group-users"],
    queryFn: async () => {
      const res = await api.get("/groups/users"); // примерный эндпоинт
      return res.data;
    },
  });

  if (isLoading) return "Loading...";

  return (
    <Paper className="p-4">
      <h2 className="text-xl mb-4">Group Users</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((u: any) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
