"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/auth/useLogin";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Min 4 chars"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const mutation = useLogin();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const onSubmit = async (data: FormValues) => {
    setError(null);
    mutation.mutate(data, {
      onError: (e: any) => {
        setError(e?.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {error && <div className="text-red-600">{error}</div>}
      <input
        {...register("email")}
        placeholder="Email"
        className="border p-2"
      />
      <div className="text-xs text-red-600">
        {formState.errors.email?.message}
      </div>

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="border p-2"
      />
      <div className="text-xs text-red-600">
        {formState.errors.password?.message}
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 mt-2">
        {mutation.isPending ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
