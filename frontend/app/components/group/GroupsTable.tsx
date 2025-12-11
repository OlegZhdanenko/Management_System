"use client";

import { useGetGroups } from "@/app/hooks/group/useGetGroups";
import { useGetAdmins } from "@/app/hooks/user/useGetAdmin";
import { useAssignAdmin } from "@/app/hooks/user/useAssignAdmin";
import { useCreateAdmin } from "@/app/hooks/user/useCreateAdmin";

import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import {
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import EditGroupModal from "./EditGroupModal";
import AssignAdminModal from "../../components/group/AssignAdminModal";

import { useState } from "react";

export default function GroupsTable() {
  const { data: groups, isLoading } = useGetGroups();
  const { data: admins } = useGetAdmins();

  const assignAdminMutation = useAssignAdmin();
  const createAdminMutation = useCreateAdmin();
  const [currentCreatorName, setCurrentCreatorName] = useState("");
  const [editGroup, setEditGroup] = useState<any>(null);
  const [assignGroup, setAssignGroup] = useState<any>(null);

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [newAdminOpen, setNewAdminOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const toggleNewAdmin = () => setNewAdminOpen((p) => !p);

  const handleAssignAdmin = () => {
    if (!assignGroup || !selectedAdmin) return;

    assignAdminMutation.mutate(
      { userId: selectedAdmin, groupId: assignGroup.id },
      {
        onSuccess: () => {
          setToast(true);
          setAssignGroup(null);
          setSelectedAdmin("");
        },
      }
    );
  };

  const handleCreateAdmin = (data: any) => {
    if (!assignGroup) return;

    createAdminMutation.mutate(data, {
      onSuccess: (createdAdmin) => {
        assignAdminMutation.mutate(
          { userId: createdAdmin.id, groupId: assignGroup.id },
          {
            onSuccess: () => {
              setToast(true);
              setNewAdminOpen(false);
              setAssignGroup(null);
              setSelectedAdmin("");
            },
          }
        );
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <Paper className="p-4">
      <Typography variant="h5" className="mb-4">
        Groups
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {groups?.map((group: any) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.creator?.name ?? "—"}</TableCell>

              <TableCell>
                <IconButton onClick={() => setEditGroup(group)}>
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setAssignGroup(group);
                    setCurrentCreatorName(group.creator?.id || "");
                    setSelectedAdmin("");
                  }}
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editGroup && (
        <EditGroupModal group={editGroup} onClose={() => setEditGroup(null)} />
      )}

      {assignGroup && (
        <AssignAdminModal
          open={true}
          onClose={() => {
            setAssignGroup(null);
            setSelectedAdmin("");
          }}
          creator={currentCreatorName}
          admins={admins || []}
          selectedAdmin={selectedAdmin}
          onSelectAdmin={setSelectedAdmin}
          onAssignAdmin={handleAssignAdmin}
          onCreateAdmin={handleCreateAdmin}
          newAdminOpen={newAdminOpen}
          toggleNewAdmin={toggleNewAdmin}
          isAssignLoading={assignAdminMutation.isPending}
          isCreateLoading={createAdminMutation.isPending}
        />
      )}

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
      >
        <Alert severity="success">Success!</Alert>
      </Snackbar>
    </Paper>
  );
}
