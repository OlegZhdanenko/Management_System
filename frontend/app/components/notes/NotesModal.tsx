"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateNote } from "@/app/hooks/notes/useCreateNotes";
import { useUpdateNote } from "@/app/hooks/notes/useUpdateNotes";
import { useDeleteNote } from "@/app/hooks/notes/useDeleteNotes";

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function NotesModal({ open, onClose, user }: NotesModalProps) {
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const handleCreate = () => {
    if (!newNote.title) return;
    createNoteMutation.mutate({ ...newNote, userId: user.id });
    setNewNote({ title: "", content: "" });
  };

  const handleUpdate = (note: any) => {
    updateNoteMutation.mutate({ id: note.id, note });
  };

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Notes for {user.name}</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          label="Title"
          fullWidth
          value={newNote.title}
          onChange={(e) =>
            setNewNote((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          minRows={3}
          value={newNote.content}
          onChange={(e) =>
            setNewNote((prev) => ({ ...prev, content: e.target.value }))
          }
        />
        <Button variant="contained" onClick={handleCreate}>
          Create Note
        </Button>

        <Table>
          <TableBody>
            {user.notes?.map((note: any) => (
              <TableRow key={note.id}>
                <TableCell>
                  <TextField
                    value={note.title}
                    onChange={(e) =>
                      handleUpdate({ ...note, title: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={note.content}
                    onChange={(e) =>
                      handleUpdate({ ...note, content: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(note.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
