import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { uploadsQueryKey } from "./useUploads";

export const useDeleteUpload = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uploadId: string) =>
      apiFetch(`/uploads/${uploadId}`, { method: "DELETE" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: uploadsQueryKey });
    },
  });
};
