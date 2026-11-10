// @/hooks/use-action-form.ts
"use client";

import { ActionResult, FieldErrors, toFieldErrors } from "@/lib/form-errors";
import { ArkErrors } from "arktype";
import { FormEvent, useState, useTransition } from "react";

export function useActionForm(
  schema: (data: unknown) => unknown,
  action: (formData: FormData) => Promise<ActionResult>,
) {
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});

  const [isPending, startTransition] = useTransition();

  const validate = (form: HTMLFormElement): FieldErrors => {
    const result = schema(Object.fromEntries(new FormData(form)));

    return result instanceof ArkErrors ? toFieldErrors(result) : {};
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(form);

    setClientErrors(found);
    setServerErrors({});

    if (Object.keys(found).length) return;

    const formData = new FormData(form);

    startTransition(async () => {
      const result = await action(formData);

      setServerErrors(result?.errors ?? {});
    });
  };

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    setServerErrors(({ [name]: _cleared, ...rest }) => rest);

    if (!Object.keys(clientErrors).length) return;

    const fresh = validate(e.currentTarget);
    setClientErrors((prev) =>
      Object.fromEntries(
        Object.entries(fresh).filter(([key]) => key in prev || key === name),
      ),
    );
  };

  const clearError = (name: string) => {
    setClientErrors(({ [name]: _a, ...rest }) => rest);
    setServerErrors(({ [name]: _a, ...rest }) => rest);
  };

  return {
    errors: { ...serverErrors, ...clientErrors } as FieldErrors,
    isPending,
    clearError,
    formProps: { onSubmit, onChange },
  };
}
