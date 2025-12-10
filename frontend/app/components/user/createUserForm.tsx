"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCreateUser } from "../../hooks/user/useCreateUser";

enum Role {
  ADMIN = "ROOT_ADMIN",
  USER = "USER",
}

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min length 6"),
  name: z.string().min(2),
  role: Role,
});

export type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserForm() {
  const { enqueueSnackbar } = useSnackbar();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema) });

  const onSubmit = (data: UserFormValues) => {
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
        <TextField
          label="Role"
          {...register("role")}
          error={!!errors.role}
          helperText={errors.role?.message}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={createUser.isPending}
        >
          Create
        </Button>
      </form>
    </Paper>
  );
}
