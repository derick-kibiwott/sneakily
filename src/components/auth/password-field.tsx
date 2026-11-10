import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "../ui/button";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  error: string | undefined;
  labelAction?: React.ReactNode;
};

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  error,
  labelAction,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = `${visible ? "Hide" : "Show"} ${label.toLowerCase()}`;

  return (
    <Field data-invalid={!!error}>
      <div className="flex items-center">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAction}
      </div>
      <InputGroup>
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type={visible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          data-invalid={!!error}
          required
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setVisible((prev) => !prev)}
                aria-label={toggleLabel}
                title={toggleLabel}
                aria-pressed={visible}
              />
            }
          >
            {visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
