import { z } from "zod";

export const ErrorCode = {
  Unauthorized: "unauthorized",
  NotFound: "not_found",
  ValidationFailed: "validation_failed",
  Internal: "internal",
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ApiErrorSchema = z.object({
  code: z.enum([
    ErrorCode.Unauthorized,
    ErrorCode.NotFound,
    ErrorCode.ValidationFailed,
    ErrorCode.Internal,
  ]),
  message: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
