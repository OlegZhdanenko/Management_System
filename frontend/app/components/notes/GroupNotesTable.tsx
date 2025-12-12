"use client";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetUsers } from "../../hooks/user/useGetUsers";
import { useState } from "react";
import NotesModal from "./NotesModal";
import EditIcon from "@mui/icons-material/Edit";
import { getRoleFromToken } from "@/app/lib/getRoleFromToken";

export default function GroupNotesTable() {
  const { data: users, isLoading } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [tokenDecode] = useState(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return getRoleFromToken(token);
  });

  let filteredUsers = users || [];

  if (tokenDecode?.role === "USER") {
    filteredUsers = filteredUsers.filter((u) => u.id === tokenDecode.id);
  } else if (tokenDecode?.role === "ADMIN") {
    filteredUsers = filteredUsers.filter((u) =>
      u.groups?.some((g: any) => g.creator?.id === tokenDecode.id)
    );
  }
  console.log({ tokenDecode });
  console.log({ users });

  console.log({ filteredUsers });

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <Paper className="p-4">
      <h2 className="text-xl mb-4">Group Users & Notes</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Notes</TableCell>
            {tokenDecode?.role === "ADMIN" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.name ?? "—"} ({user.email ?? "—"})
              </TableCell>

              <TableCell>
                <Table>
                  <TableBody>
                    {user.notes?.length ? (
                      user.notes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>{`Title: ${note.title ?? "—"}`}</TableCell>
                          <TableCell>{`Content: ${note.content ?? "—"}`}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>No notes</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>

              {(tokenDecode?.role === "ROOT_ADMIN" ||
                tokenDecode?.role === "ADMIN") && (
                <TableCell>
                  <IconButton onClick={() => setSelectedUser(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <NotesModal
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
    </Paper>
  );
}
