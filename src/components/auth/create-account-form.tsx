"use client";

import { useState } from "react";
import { cn } from "cn";
import { type } from "arktype";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { GenerateUsernameButton } from "./generate-username-button";
import { createAccountSchema } from "@/validations/auth/create-account";

export function CreateAccountForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = createAccountSchema(data);

    if (result instanceof type.errors) {
      const fieldErrors: Record<string, string> = {};
      for (const error of result) {
        const fieldName = error.path.join(".") || "form";
        fieldErrors[fieldName] = error.message;
      }
      setErrors(fieldErrors);
      return;
    }

    console.log("Valid data:", result);
  };

  const handleFormChanges = (e: React.FormEvent<HTMLFormElement>) => {
    if (Object.keys(errors).length === 0) return;
    const input = e.target as HTMLInputElement;
    const fieldName = input.name;
    if (!fieldName) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = createAccountSchema(data);

    setErrors((prevErrors) => {
      if (!(result instanceof type.errors)) {
        return {};
      }

      const targetHasError = result.some(
        (error) => error.path.join(".") === fieldName,
      );

      if (fieldName === "password" || fieldName === "confirmPassword") {
        const confirmPasswordError = result.some(
          (err) => err.path.join(".") === "confirmPassword",
        );

        const nextErrors = { ...prevErrors };
        if (!targetHasError) delete nextErrors[fieldName];
        if (!confirmPasswordError) delete nextErrors["confirmPassword"];

        return nextErrors;
      }

      if (!targetHasError && prevErrors[fieldName]) {
        const nextErrors = { ...prevErrors };
        delete nextErrors[fieldName];
        return nextErrors;
      }

      return prevErrors;
    });
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        onSubmit?.(e);
      }}
      onChange={handleFormChanges}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-bold">
            Create your account
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign up to get started. Your identity stays private.
          </p>
        </div>

        <Field data-invalid={!!errors.anonymousUsername}>
          <FieldLabel htmlFor="anonymous-username">
            Anonymous Username
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <User />
            </InputGroupAddon>
            <InputGroupInput
              id="anonymous-username"
              type="text"
              name="anonymousUsername"
              placeholder="Enter your anonymous username"
              autoComplete="username"
              data-invalid={!!errors.anonymousUsername}
              required
            />
            <InputGroupAddon align="inline-end" className="pr-0">
              <GenerateUsernameButton />
            </InputGroupAddon>
          </InputGroup>
          {errors.anonymousUsername ? (
            <FieldError>{errors.anonymousUsername}</FieldError>
          ) : (
            <FieldDescription>
              No username in mind? Tap the sparkle to generate one.
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              data-invalid={!!errors.password}
              required
            />
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{errors.password}</FieldError>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              autoComplete="new-password"
              data-invalid={!!errors.confirmPassword}
              required
            />
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{errors.confirmPassword}</FieldError>
        </Field>

        <Field>
          <Button size="lg" type="submit">
            Create account
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
