"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, Button, Box } from "@mui/material";
import { useVerify } from "@/app/hooks/auth/useVerify";

interface VerifyFormProps {
  email: string;
  onVerified: () => void;
}

const verifySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
  email: z.string().email("Invalid email"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyForm({ email, onVerified }: VerifyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useVerify();

  const onSubmit = (values: VerifyFormValues) => {
    verifyMutation.mutate(
      { token: values.token, email: email || values.email },
      {
        onSuccess: () => {
          onVerified();
        },
      }
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Verification Token"
        {...register("token")}
        error={!!errors.token}
        helperText={errors.token?.message}
        fullWidth
      />
      <TextField
        label="Enter your email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disabled={verifyMutation.isPending}
      >
        Verify
      </Button>
    </Box>
  );
}
