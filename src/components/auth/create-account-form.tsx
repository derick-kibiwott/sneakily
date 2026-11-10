"use client";

import { cn } from "cn";
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
import { User } from "lucide-react";
import { GenerateUsernameButton } from "./generate-username-button";
import { createAccountSchema } from "@/validations/auth";
import { PasswordField } from "./password-field";
import { useActionForm } from "@/hooks/use-action-form";
import { signUpAction } from "@/actions/auth/create-account";
import { useGenerateUsername } from "@/hooks/use-generate-username";
import { Skeleton } from "@/components/ui/skeleton";

export function CreateAccountForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"form">) {
  const { errors, isPending, clearError, formProps } = useActionForm(
    createAccountSchema,
    signUpAction,
  );

  const generator = useGenerateUsername({
    onGenerated: () => clearError("anonymousUsername"),
  });

  const usernameError =
    errors.anonymousUsername ?? generator.error ?? undefined;

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      {...formProps}
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

        <FieldError className="border p-2 bg-card rounded-md">
          {errors.form}
        </FieldError>

        <Field data-invalid={!!usernameError}>
          <FieldLabel htmlFor="anonymous-username">
            Anonymous Username
          </FieldLabel>
          <InputGroup aria-busy={generator.isGenerating}>
            <InputGroupAddon>
              <User />
            </InputGroupAddon>
            {generator.isGenerating ? (
              <Skeleton className="mx-2 h-4 flex-1" aria-hidden />
            ) : (
              <InputGroupInput
                id="anonymous-username"
                type="text"
                name="anonymousUsername"
                placeholder="Enter your anonymous username"
                autoComplete="username"
                value={generator.username}
                onChange={(e) => generator.setUsername(e.target.value)}
                data-invalid={!!usernameError}
                required
              />
            )}
            <InputGroupAddon align="inline-end" className="pr-0">
              <GenerateUsernameButton
                onClick={generator.generate}
                isPending={generator.isGenerating}
              />
            </InputGroupAddon>
          </InputGroup>
          {usernameError ? (
            <FieldError>{usernameError}</FieldError>
          ) : (
            <FieldDescription>
              No username in mind? Tap the sparkle to generate one.
            </FieldDescription>
          )}
        </Field>
        <PasswordField
          id="password"
          name="password"
          label="password"
          placeholder="Enter password"
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordField
          id="confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <Field>
          <Button
            size="lg"
            type="submit"
            disabled={isPending || generator.isGenerating}
          >
            {isPending ? "Creating account..." : "Create account"}
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
