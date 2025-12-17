"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCreateGroup } from "../../hooks/group/useCreateGroup";
import { useRouter } from "next/navigation";

const groupSchema = z.object({
  name: z.string().min(3, "Group name is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

export default function CreateGroupForm() {
  const { enqueueSnackbar } = useSnackbar();
  const createGroup = useCreateGroup();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({ resolver: zodResolver(groupSchema) });

  const onSubmit = (data: GroupFormValues) => {
    createGroup.mutate(data, {
      onSuccess: () => {
        enqueueSnackbar("Group created successfully!", { variant: "success" });
        reset();
        router.push("/dashboard");
      },
      onError: () => {
        enqueueSnackbar("Failed to create group", { variant: "error" });
      },
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" mb={2}>
        Create Group
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Group Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={createGroup.isPending}
        >
          Create
        </Button>
      </form>
    </Paper>
  );
}
