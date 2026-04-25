import type { HelloResponse } from "@twotier/shared/api";

export async function getGreeting(
  userId: string,
  username: string,
): Promise<HelloResponse> {
  return { message: `Hello, ${username}!`, userId };
}
