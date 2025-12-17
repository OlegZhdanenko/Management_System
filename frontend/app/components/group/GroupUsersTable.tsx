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
  Snackbar,
  Alert,
} from "@mui/material";
import { useGetGroups } from "@/app/hooks/group/useGetGroups";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import DeleteUserModal from "../../components/user/DeleteUserModal";
import { useDeleteUser } from "@/app/hooks/user/useDeleteUser";
import { useCurrentUser } from "@/app/hooks/auth/useCurrentUser";

export default function GroupUsersTable() {
  const { data: groups, isLoading } = useGetGroups();
  const deleteUserMutation = useDeleteUser();
  const { data: currentUser } = useCurrentUser();

  const currentGroup = groups?.find(
    (group) => group.creator.id === currentUser?.id
  );

  const [deleteUser, setDeleteUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [toast, setToast] = useState(false);

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;

    deleteUserMutation.mutate(deleteUser.id, {
      onSuccess: () => {
        setToast(true);
        setDeleteUser(null);
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );

  const groupsToRender =
    currentUser?.role === "ADMIN" && currentGroup ? [currentGroup] : groups;

  return (
    <Paper className="p-4">
      <h2 className="text-xl mb-4">Group and Users</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Users</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {groupsToRender?.map((group: any) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.creator?.name || "—"}</TableCell>
              <TableCell>
                {group.users?.length ? (
                  <Table>
                    <TableBody>
                      {group.users.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            {user.name ?? "—"} ({user.email ?? "—"})
                          </TableCell>
                          {currentUser!.role !== "ADMIN" && (
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  setDeleteUser({
                                    id: user.id,
                                    name: user.name,
                                  })
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  "No users"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {deleteUser && (
        <DeleteUserModal
          open={!!deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDeleteConfirm}
          userName={deleteUser.name}
        />
      )}

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
      >
        <Alert severity="success">User deleted successfully!</Alert>
      </Snackbar>
    </Paper>
  );
}
