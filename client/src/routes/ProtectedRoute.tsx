import { Navigate, Outlet } from "react-router";
import { useSession } from "@/features/auth/useSession";

export const ProtectedRoute = (): React.ReactElement => {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (!data) return <Navigate to="/sign-in" replace />;

  return <Outlet />;
};
