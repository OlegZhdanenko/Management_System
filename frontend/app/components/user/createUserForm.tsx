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
import { useSnackbar } from "notistack";

import { useCreateUser } from "../../hooks/user/useCreateUser";

import { useState } from "react";
import { useCreateGroup } from "@/app/hooks/group/useCreateGroup";
import { useGetGroups } from "@/app/hooks/group/useGetGroups";
import { getRoleFromToken } from "@/app/lib/getRoleFromToken";

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min length 4"),
  name: z.string().min(2),
  groupId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserForm() {
  const { enqueueSnackbar } = useSnackbar();

  const createUser = useCreateUser();
  const { data: groups = [] } = useGetGroups();
  const createGroup = useCreateGroup();

  const [newGroupName, setNewGroupName] = useState("");

  const [tokenDecode] = useState(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return getRoleFromToken(token);
  });
  const currentGroupId = groups.find(
    (group) => group.creator.id === tokenDecode?.id
  );

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
          enqueueSnackbar("Group created!", { variant: "success" });
          {
            setValue("groupId", group.id);
          }
          setNewGroupName("");
        },
      }
    );
  };

  const onSubmit = (data: UserFormValues) => {
    if (tokenDecode?.role === "ADMIN") {
      data.groupId = currentGroupId?.id ?? undefined;
    }
    createUser.mutate(data, {
      onSuccess: () => {
        enqueueSnackbar("User created successfully!", { variant: "success" });
        reset();
      },
      onError: () => {
        enqueueSnackbar("Failed to create user", { variant: "error" });
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

        {tokenDecode?.role === "ROOT_ADMIN" && (
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
