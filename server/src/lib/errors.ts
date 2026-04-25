import type { Context } from "hono";
import { type ApiError, ErrorCode } from "@twotier/shared/errors";

type AppErrorInit = {
  code: ErrorCode;
  message: string;
  httpStatus: number;
  details?: unknown;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: unknown;

  constructor(init: AppErrorInit) {
    super(init.message);
    this.name = "AppError";
    this.code = init.code;
    this.httpStatus = init.httpStatus;
    this.details = init.details;
  }
}

export const unauthorized = (message = "Unauthorized"): AppError =>
  new AppError({ code: ErrorCode.Unauthorized, message, httpStatus: 401 });

export const notFound = (message = "Not found"): AppError =>
  new AppError({ code: ErrorCode.NotFound, message, httpStatus: 404 });

export const validationFailed = (
  message: string,
  details?: unknown,
): AppError =>
  new AppError({
    code: ErrorCode.ValidationFailed,
    message,
    httpStatus: 400,
    details,
  });

const toApiError = (err: unknown): { status: number; body: ApiError } => {
  if (err instanceof AppError) {
    return {
      status: err.httpStatus,
      body: { code: err.code, message: err.message, details: err.details },
    };
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  return {
    status: 500,
    body: { code: ErrorCode.Internal, message },
  };
};

export const onError = (err: Error, c: Context): Response => {
  const { status, body } = toApiError(err);
  if (status >= 500) {
    console.error("[server] unhandled error:", err);
  }
  return c.json(body, status as 400 | 401 | 404 | 500);
};
