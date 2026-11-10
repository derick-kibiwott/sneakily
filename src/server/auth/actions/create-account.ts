"use server";

export type GenerateUsernameResult = { username: string } | { error: string };

export async function generateUsernameAction(): Promise<GenerateUsernameResult> {}
