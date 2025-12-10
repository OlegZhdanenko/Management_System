"use client";

import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateAdminDto = z.infer<typeof CreateAdminSchema>;

interface CreateAdminFormProps {
  onSubmit: (data: CreateAdminDto) => void;
  isLoading?: boolean;
}

export default function CreateAdminForm({
  onSubmit,
  isLoading,
}: CreateAdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminDto>({
    resolver: zodResolver(CreateAdminSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
      <TextField
        label="Name"
        fullWidth
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
        {isLoading ? "Creating..." : "Create & Assign"}
      </Button>
    </form>
  );
}
