import type { MiddlewareHandler } from "hono";
import { auth, type Session } from "@/lib/auth";
import { unauthorized } from "@/lib/errors";

export type AuthVariables = {
  session: Session["session"];
  user: Session["user"];
};

export const requireSession: MiddlewareHandler<{
  Variables: AuthVariables;
}> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw unauthorized();
  }
  c.set("session", session.session);
  c.set("user", session.user);
  await next();
};
