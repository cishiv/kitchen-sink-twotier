import { Hono } from "hono";
import {
  handleDeleteUpload,
  handleListUploads,
  handlePresignUpload,
} from "@/controllers/uploads.controller";
import type { AuthVariables } from "@/middleware/auth";

export const uploadsRoutes = new Hono<{ Variables: AuthVariables }>()
  .post("/uploads/presign", handlePresignUpload)
  .get("/uploads", handleListUploads)
  .delete("/uploads/:id", handleDeleteUpload);
