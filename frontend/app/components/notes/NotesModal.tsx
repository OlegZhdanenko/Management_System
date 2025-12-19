"use client";

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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import z from "zod";

import { useCreateNote } from "@/app/hooks/notes/useCreateNotes";
import { useUpdateNote } from "@/app/hooks/notes/useUpdateNotes";
import { useDeleteNote } from "@/app/hooks/notes/useDeleteNotes";
import { useUserWithNotes } from "@/app/hooks/user/useUserWithNotes";
import { Note } from "@/app/types/types";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function NotesModal({ open, onClose, userId }: NotesModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  console.log({ userId });

  const { data: user, isLoading } = useUserWithNotes(userId, open);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user?.notes) {
      setNotes(user.notes);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
  });

  const onCreate = (data: NoteFormValues) => {
    createNote.mutate(
      { ...data, userId },
      {
        onSuccess: (newNote) => {
          setNotes((prev) => [...prev, newNote]);
          reset();
        },
        onError: () =>
          enqueueSnackbar("Failed to create note", { variant: "error" }),
      }
    );
  };

  const handleEditChange = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, [field]: value } : note))
    );
  };

  const handleSave = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    updateNote.mutate({
      id,
      note: { title: note.title, content: note.content },
    });
  };

  const handleDelete = (id: string) => {
    deleteNote.mutate(id, {
      onSuccess: () => {
        enqueueSnackbar("Note deleted", { variant: "success" });
        setNotes((prev) => prev.filter((n) => n.id !== id));
      },
      onError: () =>
        enqueueSnackbar("Failed to delete note", { variant: "error" }),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isLoading ? "Loading..." : `Notes for ${user?.name}`}
      </DialogTitle>

      <DialogContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
              <TextField
                label="Title"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                label="Content"
                fullWidth
                multiline
                minRows={3}
                {...register("content")}
              />

              <Button type="submit" variant="contained">
                Create Note
              </Button>
            </form>

            <Table>
              <TableBody>
                {notes.length ? (
                  notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <TextField
                          value={note.title}
                          fullWidth
                          onChange={(e) =>
                            handleEditChange(note.id, "title", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={note.content}
                          fullWidth
                          multiline
                          onChange={(e) =>
                            handleEditChange(note.id, "content", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSave(note.id)}
                        >
                          Save
                        </Button>
                        <IconButton onClick={() => handleDelete(note.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No notes</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
