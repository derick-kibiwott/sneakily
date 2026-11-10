import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type RecoveryPhraseStepProps = {
  recoveryPhrase: string;
  setRecoveryPhrase: (value: string) => void;
};

export function RecoveryPhraseStep({
  recoveryPhrase,
  setRecoveryPhrase,
}: RecoveryPhraseStepProps) {
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mb-2 p-4 rounded-full bg-muted">
          <KeyRound className="size-5" />
        </div>
        <h2 className="font-heading text-xl font-semibold">
          Verify your identity
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the recovery phrase you received when creating your account.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="recovery-phrase">Recovery Phrase</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <KeyRound />
          </InputGroupAddon>
          <InputGroupInput
            id="recovery-phrase"
            name="recoveryPhrase"
            placeholder="Enter your recovery phrase"
            type={showRecoveryPhrase ? "text" : "password"}
            autoComplete="off"
            value={recoveryPhrase}
            onChange={(e) => setRecoveryPhrase(e.target.value)}
            required
          />
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setShowRecoveryPhrase((prev) => !prev)}
              aria-label={
                showRecoveryPhrase
                  ? "Hide recovery phrase"
                  : "Show recovery phrase"
              }
              aria-pressed={showRecoveryPhrase}
            >
              {showRecoveryPhrase ? <EyeOff /> : <Eye />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Your recovery phrase is the only way to regain access to your account.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
