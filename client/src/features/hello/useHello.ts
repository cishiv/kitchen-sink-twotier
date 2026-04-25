import { useQuery } from "@tanstack/react-query";
import { HelloResponseSchema } from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";

export const useHello = () =>
  useQuery({
    queryKey: ["hello"],
    queryFn: async () => HelloResponseSchema.parse(await apiFetch("/hello")),
  });
