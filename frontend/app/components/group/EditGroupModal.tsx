"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditGroup } from "@/app/hooks/group/useEditGroup";
import { Group } from "@/app/types/types";

const schema = z.object({
  name: z.string().min(2),
});
interface IGroup {
  name: string;
}
export default function EditGroupModal({
  group,
  onClose,
}: {
  group: Group;
  onClose: () => void;
}) {
  const editGroupMutation = useEditGroup();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: group.name },
  });

  const submit = (data: IGroup) => {
    editGroupMutation.mutate(
      { id: group.id, ...data },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Edit Group</DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <TextField label="Name" fullWidth {...register("name")} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
