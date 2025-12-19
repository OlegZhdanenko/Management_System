"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/auth/useLogin";
import { useRouter } from "next/navigation";
import { TextField, Button, Box } from "@mui/material";

interface LoginFormProps {
  onNeedVerify: (email: string) => void;
  toggleMode: () => void;
}

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min 4 chars"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm({
  onNeedVerify,
  toggleMode,
}: LoginFormProps) {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        if (data.needsVerification) {
          onNeedVerify(data.email);
        } else {
          router.push("/dashboard");
        }
      },
      onError: () => {
        toggleMode();
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
        error={!!formState.errors.email}
        helperText={formState.errors.email?.message}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        {...register("password")}
        error={!!formState.errors.password}
        helperText={formState.errors.password?.message}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        // disabled={formState.isSubmitting || loginMutation.isLoading}
      >
        Login
      </Button>
    </Box>
  );
}
