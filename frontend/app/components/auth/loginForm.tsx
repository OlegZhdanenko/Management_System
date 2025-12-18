"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/auth/useLogin";

import { useRouter } from "next/navigation";
import { TextField, Button, Box } from "@mui/material";
import { useSnackbar } from "notistack";

interface LoginFormProps {
  onNeedVerify: (email: string) => void;
}

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min 4 chars"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm({ onNeedVerify }: LoginFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useLogin();

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        if (data.needsVerification) {
          onNeedVerify(data.email);
          enqueueSnackbar("Please verify your account", { variant: "info" });
        } else {
          enqueueSnackbar("Login successful", { variant: "success" });
          router.push("/dashboard");
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(error.message || "Login failed", { variant: "error" });
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || mutation.isLoading}
      >
        Login
      </Button>
    </Box>
  );
}
