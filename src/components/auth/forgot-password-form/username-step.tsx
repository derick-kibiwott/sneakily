import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";

type UsernameStepProps = {
  username: string;
  setUsername: (value: string) => void;
};

export function UsernameStep({ username, setUsername }: UsernameStepProps) {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mb-2 p-4 rounded-full bg-muted">
          <UserRound className="size-5" />
        </div>
        <h2 className="font-heading text-xl font-semibold">
          Identify your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your anonymous username to begin recovering your account.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="username">Anonymous Username</FieldLabel>
        <Input
          id="username"
          name="username"
          placeholder="Enter your username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Field>
    </FieldGroup>
  );
}
