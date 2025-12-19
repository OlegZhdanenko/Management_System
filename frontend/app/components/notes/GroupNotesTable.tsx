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
import { useCurrentUser } from "@/app/hooks/auth/useCurrentUser";

export default function GroupNotesTable() {
  const { data: users, isLoading } = useGetUsers();
  const { data: currentUser } = useCurrentUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = users?.find((u) => u.id === selectedUserId) ?? null;

  let filteredUsers = users || [];

  if (currentUser?.role === "USER") {
    filteredUsers = filteredUsers.filter((u) => u.id === currentUser.id);
  } else if (currentUser?.role === "ADMIN") {
    filteredUsers = filteredUsers.filter((u) =>
      u.groups?.some((g) => g.creator?.id === currentUser.id)
    );
  }

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
            {currentUser?.role !== "ADMIN" && <TableCell>Actions</TableCell>}
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

              {currentUser?.role === "ADMIN" || (
                <TableCell>
                  <IconButton onClick={() => setSelectedUserId(user.id)}>
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
          open
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </Paper>
  );
}
