"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, Button, Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

interface VerifyFormProps {
  email: string;
  onVerified: () => void;
}

const verifySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyForm({ email, onVerified }: VerifyFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyFormValues) => {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: data.token }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Verification failed");
      return result;
    },
    onSuccess: () => {
      enqueueSnackbar("Account verified successfully", { variant: "success" });
      onVerified();
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || "Verification failed", {
        variant: "error",
      });
    },
  });

  const onSubmit = (values: VerifyFormValues) => verifyMutation.mutate(values);

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
      <Button
        type="submit"
        variant="contained"
        // disabled={isSubmitting || verifyMutation.isLoading}
      >
        Verify
      </Button>
    </Box>
  );
}
