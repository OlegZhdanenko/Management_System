"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useCreateUser } from "../../hooks/user/useCreateUser";
import { useState } from "react";
import { useCreateGroup } from "@/app/hooks/group/useCreateGroup";
import { useGetGroups } from "@/app/hooks/group/useGetGroups";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/hooks/auth/useCurrentUser";

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min length 4"),
  name: z.string().min(2),
  groupId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserForm() {
  const { data: currentUser } = useCurrentUser();
  const createUser = useCreateUser();
  const { data: groups = [] } = useGetGroups();
  const createGroup = useCreateGroup();

  const [newGroupName, setNewGroupName] = useState("");

  const currentGroupId = groups.find(
    (group) => group.creator.id === currentUser?.id
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema) });

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    createGroup.mutate(
      { name: newGroupName },
      {
        onSuccess: (group) => {
          {
            setValue("groupId", group.id);
          }
          setNewGroupName("");
        },
      }
    );
  };

  const onSubmit = (data: UserFormValues) => {
    if (currentUser?.role === "ADMIN") {
      data.groupId = currentGroupId?.id ?? undefined;
    }
    createUser.mutate(data, {
      onSuccess: () => {
        reset();
        router.push("/dashboard");
      },
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" mb={2}>
        Create User
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {currentUser?.role === "ROOT_ADMIN" && (
          <>
            <FormControl fullWidth>
              <InputLabel>Group</InputLabel>
              <Select label="Group" defaultValue="" {...register("groupId")}>
                {groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}

                {groups.length === 0 && (
                  <MenuItem disabled>Нет групп — создайте ниже</MenuItem>
                )}
              </Select>
            </FormControl>

            {errors.groupId && (
              <Typography color="error">{errors.groupId.message}</Typography>
            )}

            <div className="flex gap-2">
              <TextField
                label="New Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                Create
              </Button>
            </div>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={createUser.isPending}
        >
          Create User
        </Button>
      </form>
    </Paper>
  );
}
