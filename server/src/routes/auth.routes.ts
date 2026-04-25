import { Hono } from "hono";
import { auth } from "@/lib/auth";

export const authRoutes = new Hono().on(
  ["GET", "POST"],
  "/api/auth/*",
  (c) => auth.handler(c.req.raw),
);
