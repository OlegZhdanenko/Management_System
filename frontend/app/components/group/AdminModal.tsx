"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";

export default function AdminModal({
  open,
  onClose,
  admins,
  selectedAdmin,
  setSelectedAdmin,
  newAdminOpen,
  setNewAdminOpen,
  onCreateAdmin,
  createAdminForm,
  onAssign,
  assignPending,
  createPending,
}: any) {
  const form = createAdminForm;
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Group Admin</DialogTitle>
      <DialogContent className="space-y-4">
        {admins?.length ? (
          <FormControl fullWidth>
            <InputLabel>Select Admin</InputLabel>
            <Select
              value={selectedAdmin}
              label="Select Admin"
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              {admins.map((a: any) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Alert severity="warning">No admins available</Alert>
        )}

        <Button
          variant="outlined"
          onClick={() => setNewAdminOpen((s: boolean) => !s)}
        >
          Create Admin
        </Button>

        {newAdminOpen && (
          <form
            onSubmit={form.handleSubmit(onCreateAdmin)}
            className="mt-3 space-y-3 border p-3 rounded"
          >
            <TextField
              fullWidth
              label="Name"
              {...form.register("name")}
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message as any}
            />
            <TextField
              fullWidth
              label="Email"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message as any}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message as any}
            />
            <Button type="submit" variant="contained" disabled={createPending}>
              {createPending ? "Creating..." : "Create & Assign"}
            </Button>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onAssign}
          disabled={!selectedAdmin || assignPending}
        >
          {assignPending ? "Assigning..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
