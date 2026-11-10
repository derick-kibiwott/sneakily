"use client";

import { useState } from "react";
import { cn } from "cn";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { PasswordStep } from "./forgot-password-form/password-step";
import { RecoveryPhraseStep } from "./forgot-password-form/recovery-phrase-step";
import { UsernameStep } from "./forgot-password-form/username-step";
import Link from "next/link";

type RecoveryData = {
  username: string;
  recoveryPhrase: string;
  password: string;
};

type ForgotPasswordFormProps = {
  className?: string;
  onComplete?: (data: RecoveryData) => void;
};

export function ForgotPasswordForm({
  className,
  onComplete,
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step < 2) {
      setStep((prev) => prev + 1);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    onComplete?.({
      username,
      recoveryPhrase,
      password,
    });
  };

  const handleBack = () => {
    setPasswordError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <FieldGroup>
        {/* Progress indicator */}
        <div
          className="flex items-center gap-2"
          aria-label={`Step ${step + 1} of 3`}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        <p
          className="text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          Step {step + 1} of 3
        </p>

        {/* Current step */}
        {step === 0 && (
          <UsernameStep username={username} setUsername={setUsername} />
        )}

        {step === 1 && (
          <RecoveryPhraseStep
            recoveryPhrase={recoveryPhrase}
            setRecoveryPhrase={setRecoveryPhrase}
          />
        )}

        {step === 2 && (
          <PasswordStep
            password={password}
            confirmPassword={confirmPassword}
            setPassword={(value) => {
              setPassword(value);
              setPasswordError("");
            }}
            setConfirmPassword={(value) => {
              setConfirmPassword(value);
              setPasswordError("");
            }}
            passwordError={passwordError}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft />
              Back
            </Button>
          )}

          <Button type="submit" size="lg" className="flex-2">
            {step === 2 ? "Reset password" : "Continue"}
          </Button>
        </div>
        <FieldDescription className="text-center">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
