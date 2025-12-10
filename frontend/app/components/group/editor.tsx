"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Group } from "../../hooks/group/useGetGroup";
import { useEditGroup } from "../../hooks/useEditGroup";

interface GroupEditorProps {
  group: Group;
}

export default function GroupEditor({ group }: GroupEditorProps) {
  const [open, setOpen] = useState(false);

  const [groupName, setGroupName] = useState(group.name);

  const [users, setUsers] = useState(group.users || []);
  const [newUserEmail, setNewUserEmail] = useState("");

  const [notes, setNotes] = useState(group.notes || []);
  const [newNoteContent, setNewNoteContent] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const editGroup = useEditGroup();

  const handleAddUser = () => {
    if (!newUserEmail) return;
    if (users.find((u) => u.email === newUserEmail)) {
      setSnackbar({ open: true, message: "User already exists" });
      return;
    }

    setUsers([...users, { email: newUserEmail, role: "member" }]);
    setNewUserEmail("");
  };

  const handleRemoveUser = (email: string) => {
    setUsers(users.filter((u) => u.email !== email));
  };

  const handleAddNote = () => {
    if (!newNoteContent) return;

    setNotes([...notes, { id: crypto.randomUUID(), content: newNoteContent }]);

    setNewNoteContent("");
  };

  const handleRemoveNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleSaveGroup = () => {
    editGroup.mutate({
      id: group.id,
      name: groupName,
    });
  };

  const handleSaveUsers = () => {
    editGroup.mutate({
      id: group.id,
      users,
    });
  };

  const handleSaveNotes = () => {
    editGroup.mutate({
      id: group.id,
      notes,
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        className="mt-3"
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          Edit Group
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="space-y-6">
          {/* Group info */}
          <div>
            <Typography variant="h6">Group Info</Typography>
            <TextField
              label="Group Name"
              fullWidth
              className="mt-2"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <Button
              variant="contained"
              size="small"
              onClick={handleSaveGroup}
              disabled={editGroup.isPending}
              className="mt-3"
            >
              Save Group
            </Button>
          </div>

          {/* Users table */}
          <div>
            <Typography variant="h6">Users</Typography>

            <Paper className="mt-2">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleRemoveUser(user.email)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Add user */}
            <div className="flex gap-3 mt-3">
              <TextField
                label="User Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddUser}>
                Add
              </Button>
            </div>

            <Button
              variant="contained"
              size="small"
              onClick={handleSaveUsers}
              disabled={editGroup.isPending}
              className="mt-3"
            >
              Save Users
            </Button>
          </div>

          {/* Notes table */}
          <div>
            <Typography variant="h6">Notes</Typography>

            <Paper className="mt-2">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Content</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>{note.content}</TableCell>
                      <TableCell align="right">
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleRemoveNote(note.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Add new note */}
            <div className="flex gap-3 mt-3">
              <TextField
                label="New Note"
                fullWidth
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddNote}>
                Add
              </Button>
            </div>

            <Button
              variant="contained"
              size="small"
              onClick={handleSaveNotes}
              disabled={editGroup.isPending}
              className="mt-3"
            >
              Save Notes
            </Button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  );
}
