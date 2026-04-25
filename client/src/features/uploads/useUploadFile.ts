import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PresignUploadResponseSchema } from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";
import { uploadsQueryKey } from "./useUploads";

export const useUploadFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const presigned = PresignUploadResponseSchema.parse(
        await apiFetch("/uploads/presign", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
          }),
        }),
      );

      const put = await fetch(presigned.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!put.ok) {
        throw new Error(`Upload to storage failed: ${put.status}`);
      }
      return presigned;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: uploadsQueryKey });
    },
  });
};
