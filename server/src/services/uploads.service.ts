import { and, desc, eq } from "drizzle-orm";
import type {
  PresignUploadRequest,
  PresignUploadResponse,
  Upload as ApiUpload,
} from "@twotier/shared/api";
import type { DB } from "@/lib/db";
import {
  deleteObject,
  presignGet,
  presignPut,
  type Storage,
} from "@/lib/storage";
import { upload } from "@/db/schema";
import type { Upload as DbUpload } from "@/db/schema/uploads";

export type UploadsDeps = {
  db: DB;
  storage: Storage;
};

export const presignUpload = async (
  deps: UploadsDeps,
  userId: string,
  input: PresignUploadRequest,
): Promise<PresignUploadResponse> => {
  const id = crypto.randomUUID();
  const fileKey = `users/${userId}/${id}/${sanitize(input.fileName)}`;

  await deps.db.insert(upload).values({
    id,
    userId,
    fileKey,
    fileName: input.fileName,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
  });

  const uploadUrl = await presignPut(deps.storage, {
    key: fileKey,
    contentType: input.mimeType,
  });

  return { uploadId: id, uploadUrl, fileKey };
};

export const listUploadsForUser = async (
  deps: UploadsDeps,
  userId: string,
): Promise<ApiUpload[]> => {
  const rows = await deps.db
    .select()
    .from(upload)
    .where(eq(upload.userId, userId))
    .orderBy(desc(upload.createdAt));
  return Promise.all(rows.map((r) => toApiUpload(deps, r)));
};

export const deleteUpload = async (
  deps: UploadsDeps,
  userId: string,
  uploadId: string,
): Promise<boolean> => {
  const [row] = await deps.db
    .select()
    .from(upload)
    .where(and(eq(upload.id, uploadId), eq(upload.userId, userId)))
    .limit(1);
  if (!row) return false;
  await deleteObject(deps.storage, row.fileKey);
  await deps.db.delete(upload).where(eq(upload.id, uploadId));
  return true;
};

const toApiUpload = async (
  deps: UploadsDeps,
  row: DbUpload,
): Promise<ApiUpload> => ({
  id: row.id,
  fileName: row.fileName,
  fileKey: row.fileKey,
  fileSize: row.fileSize,
  mimeType: row.mimeType,
  viewUrl: await presignGet(deps.storage, { key: row.fileKey }),
  createdAt: row.createdAt.toISOString(),
});

// R2 keys are tolerant but we strip path separators and control chars
// so a malicious filename can't escape the user's prefix.
const sanitize = (name: string): string =>
  name.replace(/[^\w.\-]+/g, "_").slice(0, 200);
