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

export default function GroupNotesTable() {
  const { data: users, isLoading } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);

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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users?.map((user) => (
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
                          <TableCell>{`Title : ${note.title ?? "—"}`}</TableCell>
                          <TableCell>{`Content : ${note.content ?? "—"}`}</TableCell>
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

              <TableCell>
                <IconButton onClick={() => setSelectedUser(user)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
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
