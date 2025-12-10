"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

import CreateAdminForm, { CreateAdminDto } from "./CreateAdminForm";

interface AssignAdminModalProps {
  creator: string;
  open: boolean;
  onClose: () => void;
  admins: any[];
  selectedAdmin: string;
  onSelectAdmin: (id: string) => void;
  onAssignAdmin: () => void;
  onCreateAdmin: (data: CreateAdminDto) => void;
  newAdminOpen: boolean;
  toggleNewAdmin: () => void;
  isAssignLoading?: boolean;
  isCreateLoading?: boolean;
}

export default function AssignAdminModal({
  creator,
  open,
  onClose,
  admins,
  selectedAdmin,
  onSelectAdmin,
  onAssignAdmin,
  onCreateAdmin,
  newAdminOpen,
  toggleNewAdmin,
  isAssignLoading,
  isCreateLoading,
}: AssignAdminModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Group Admin</DialogTitle>

      <DialogContent className="space-y-4">
        {admins?.length ? (
          <FormControl fullWidth>
            <InputLabel>Select Admin</InputLabel>
            <Select
              value={creator || selectedAdmin}
              label="Select Admin"
              onChange={(e) => onSelectAdmin(e.target.value)}
            >
              {admins.map((a: any) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Alert severity="warning">
            No admins available. Create a new admin below.
          </Alert>
        )}

        <Button onClick={toggleNewAdmin} variant="outlined">
          {newAdminOpen ? "Hide" : "Create Admin"}
        </Button>

        {newAdminOpen && (
          <CreateAdminForm
            onSubmit={onCreateAdmin}
            isLoading={isCreateLoading}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onAssignAdmin}
          disabled={!selectedAdmin || isAssignLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
