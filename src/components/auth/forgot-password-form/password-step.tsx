import { useState } from "react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

type PasswordStepProps = {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  passwordError?: string;
};

export function PasswordStep({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  passwordError,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mb-2 p-4 rounded-full bg-muted">
          <LockKeyhole className="size-5" />
        </div>
        <h2 className="font-heading text-xl font-semibold">
          Create a new password
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a new password to secure your account.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="new-password">New Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
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
                showConfirmPassword ? "Hide password" : "Show password"
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </Button>
          </InputGroupAddon>
        </InputGroup>

        {passwordError && (
          <FieldDescription
            id="password-error"
            role="alert"
            className="text-destructive"
          >
            {passwordError}
          </FieldDescription>
        )}
      </Field>
    </FieldGroup>
  );
}
