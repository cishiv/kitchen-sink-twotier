import { useQuery } from "@tanstack/react-query";
import { ListUploadsResponseSchema } from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";

export const uploadsQueryKey = ["uploads"] as const;

export const useUploads = () =>
  useQuery({
    queryKey: uploadsQueryKey,
    queryFn: async () =>
      ListUploadsResponseSchema.parse(await apiFetch("/uploads")),
  });
