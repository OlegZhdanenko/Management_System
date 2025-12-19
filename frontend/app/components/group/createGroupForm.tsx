"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography } from "@mui/material";
import { useCreateGroup } from "../../hooks/group/useCreateGroup";
import { useRouter } from "next/navigation";

const groupSchema = z.object({
  name: z.string().min(3, "Group name is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

export default function CreateGroupForm() {
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
        reset();
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="p-6 max-w-md">
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
    </div>
  );
}
