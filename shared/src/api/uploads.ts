import { z } from "zod";

export const UploadSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileKey: z.string(),
  fileSize: z.number().int().nonnegative(),
  mimeType: z.string(),
  viewUrl: z.string().url(),
  createdAt: z.string(),
});
export type Upload = z.infer<typeof UploadSchema>;

export const ListUploadsResponseSchema = z.object({
  uploads: z.array(UploadSchema),
});
export type ListUploadsResponse = z.infer<typeof ListUploadsResponseSchema>;

export const PresignUploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(128),
  fileSize: z.number().int().positive().max(50 * 1024 * 1024),
});
export type PresignUploadRequest = z.infer<typeof PresignUploadRequestSchema>;

export const PresignUploadResponseSchema = z.object({
  uploadId: z.string(),
  uploadUrl: z.string().url(),
  fileKey: z.string(),
});
export type PresignUploadResponse = z.infer<typeof PresignUploadResponseSchema>;
