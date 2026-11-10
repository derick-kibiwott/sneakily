"use client";

import { cn } from "cn";
import Link from "next/link";
import { User } from "lucide-react";
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
import { PasswordField } from "./password-field";
import { useActionForm } from "@/hooks/use-action-form";
import { loginSchema } from "@/validations/auth";
import { loginAction } from "@/actions/auth/login";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { errors, isPending, formProps } = useActionForm(
    loginSchema,
    loginAction,
  );
  

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      {...formProps}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-heading text-2xl font-bold">
            Login to your account
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your username and password below
          </p>
        </div>

        <FieldError className="border p-2 bg-card rounded-md">
          {errors.form}
        </FieldError>

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
          </InputGroup>
          <FieldError>{errors.anonymousUsername}</FieldError>
        </Field>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          labelAction={
            <Link
              href={"/auth/forgot-password"}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          }
        />

        <Field>
          <Button size="lg" type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/create-account"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
