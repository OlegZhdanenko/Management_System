"use client";

import { useState } from "react";
import { Button, Box } from "@mui/material";

import VerifyForm from "./VerifyForm";
import LoginForm from "./loginForm";

type AuthMode = "login" | "verify";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("verify");
  const [email, setEmail] = useState<string>("");

  const handleNeedVerify = (userEmail: string) => {
    setEmail(userEmail);
    setMode("verify");
  };

  const handleVerified = () => {
    setMode("login");
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "verify" : "login"));
  };

  return (
    <Box className="max-w-md mx-auto mt-20 space-y-4">
      <div className="flex justify-end">
        <Button onClick={toggleMode} variant="text" size="small">
          {mode === "login" ? "Switch to Verify" : "Switch to Login"}
        </Button>
      </div>

      {mode === "login" && <LoginForm onNeedVerify={handleNeedVerify} />}

      {mode === "verify" && (
        <VerifyForm email={email} onVerified={handleVerified} />
      )}
    </Box>
  );
}
