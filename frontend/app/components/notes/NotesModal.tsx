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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";

import { useCreateNote } from "@/app/hooks/notes/useCreateNotes";
import { useUpdateNote } from "@/app/hooks/notes/useUpdateNotes";
import { useDeleteNote } from "@/app/hooks/notes/useDeleteNotes";
import z from "zod";
import { Note, User } from "@/app/types/types";
import { queryClient } from "@/app/services/react-query";

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}
export const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export default function NotesModal({ open, onClose, user }: NotesModalProps) {
  const { enqueueSnackbar } = useSnackbar();

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onCreate = (data: NoteFormValues) => {
    createNote.mutate(
      { ...data, userId: user.id },
      {
        onSuccess: () => {
          enqueueSnackbar("Note created", { variant: "success" });
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          reset();
          onClose();
        },
        onError: () => {
          enqueueSnackbar("Failed to create note", { variant: "error" });
        },
      }
    );
  };

  const handleUpdate = (note: Note) => {
    updateNote.mutate(
      {
        id: note.id,
        note: { title: note.title, content: note.content },
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Note updated", { variant: "success" });
          onClose();
        },
        onError: () => {
          enqueueSnackbar("Failed to update note", { variant: "error" });
        },
      }
    );
  };

  const handleDelete = (noteId: string) => {
    deleteNote.mutate(noteId, {
      onSuccess: () => {
        enqueueSnackbar("Note deleted", { variant: "success" });
        onClose();
      },
      onError: () => {
        enqueueSnackbar("Failed to delete note", { variant: "error" });
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Notes for {user.name}</DialogTitle>

      <DialogContent className="space-y-4">
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
            error={!!errors.content}
            helperText={errors.content?.message}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={createNote.isPending}
          >
            Create Note
          </Button>
        </form>

        <Table>
          <TableBody>
            {user.notes?.length ? (
              user.notes.map((note: Note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <TextField
                      defaultValue={note.title}
                      fullWidth
                      onBlur={() => handleUpdate(note)}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      defaultValue={note.content}
                      fullWidth
                      multiline
                      onBlur={(e) =>
                        handleUpdate({ ...note, title: e.target.value })
                      }
                    />
                  </TableCell>

                  <TableCell>
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
