import type { Context } from "hono";
import { HelloResponseSchema } from "@twotier/shared/api";
import type { AuthVariables } from "@/middleware/auth";
import { getGreeting } from "@/services/hello.service";

export async function handleHello(
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> {
  const user = c.get("user");
  const usernameValue = user.username ?? user.name;
  const data = await getGreeting(user.id, usernameValue);
  const payload =
    process.env.NODE_ENV === "development"
      ? HelloResponseSchema.parse(data)
      : data;
  return c.json(payload);
}
