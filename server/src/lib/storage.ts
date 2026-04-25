import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireEnv } from "@/lib/env";

// Cloudflare R2 is S3-compatible. The auth + endpoint pattern below is
// the canonical R2 setup; nothing here is R2-specific beyond the URL.

let cachedClient: S3Client | null = null;
let cachedBucket: string | null = null;

const getStorage = (): { client: S3Client; bucket: string } => {
  if (cachedClient && cachedBucket) {
    return { client: cachedClient, bucket: cachedBucket };
  }
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  cachedBucket = requireEnv("R2_BUCKET");
  return { client: cachedClient, bucket: cachedBucket };
};

export type Storage = {
  client: S3Client;
  bucket: string;
};

export const storage: Storage = new Proxy({} as Storage, {
  get: (_, prop, receiver) => Reflect.get(getStorage(), prop, receiver),
});

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
