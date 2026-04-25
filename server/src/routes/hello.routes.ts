import { Hono } from "hono";
import { handleHello } from "@/controllers/hello.controller";
import type { AuthVariables } from "@/middleware/auth";

export const helloRoutes = new Hono<{ Variables: AuthVariables }>().get(
  "/hello",
  handleHello,
);
