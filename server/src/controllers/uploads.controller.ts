import type { Context } from "hono";
import { PresignUploadRequestSchema } from "@twotier/shared/api";
import { db } from "@/lib/db";
import { notFound, validationFailed } from "@/lib/errors";
import { storage } from "@/lib/storage";
import type { AuthVariables } from "@/middleware/auth";
import {
  deleteUpload,
  listUploadsForUser,
  presignUpload,
} from "@/services/uploads.service";

const deps = { db, storage };

export const handlePresignUpload = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const body = PresignUploadRequestSchema.safeParse(await c.req.json());
  if (!body.success) {
    throw validationFailed("Invalid upload request", body.error.flatten());
  }
  const user = c.get("user");
  const result = await presignUpload(deps, user.id, body.data);
  return c.json(result);
};

export const handleListUploads = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const user = c.get("user");
  const uploads = await listUploadsForUser(deps, user.id);
  return c.json({ uploads });
};

export const handleDeleteUpload = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const user = c.get("user");
  const id = c.req.param("id");
  if (!id) throw notFound("Upload not found");
  const removed = await deleteUpload(deps, user.id, id);
  if (!removed) throw notFound("Upload not found");
  return c.body(null, 204);
};
