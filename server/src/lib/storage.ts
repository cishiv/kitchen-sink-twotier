import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

// Cloudflare R2 is S3-compatible. The auth + endpoint pattern below is
// the canonical R2 setup; nothing here is R2-specific beyond the URL.
export const storageClient = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export const storageBucket = env.R2_BUCKET;

export type Storage = {
  client: S3Client;
  bucket: string;
};

export const storage: Storage = {
  client: storageClient,
  bucket: storageBucket,
};

export type PresignPutInput = {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
};

export const presignPut = (
  s: Storage,
  input: PresignPutInput,
): Promise<string> =>
  getSignedUrl(
    s.client,
    new PutObjectCommand({
      Bucket: s.bucket,
      Key: input.key,
      ContentType: input.contentType,
    }),
    { expiresIn: input.expiresInSeconds ?? 60 * 5 },
  );

export type PresignGetInput = {
  key: string;
  expiresInSeconds?: number;
};

export const presignGet = (
  s: Storage,
  input: PresignGetInput,
): Promise<string> =>
  getSignedUrl(
    s.client,
    new GetObjectCommand({ Bucket: s.bucket, Key: input.key }),
    { expiresIn: input.expiresInSeconds ?? 60 * 5 },
  );

export const deleteObject = async (s: Storage, key: string): Promise<void> => {
  await s.client.send(
    new DeleteObjectCommand({ Bucket: s.bucket, Key: key }),
  );
};
