import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHello } from "@/features/hello/useHello";
import { authClient } from "@/lib/auth-client";
import { ApiError } from "@/lib/api";
import { queryClient } from "@/lib/query-client";

export const HelloCard = (): React.ReactElement => {
  const navigate = useNavigate();
  const { data, error, isPending } = useHello();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      queryClient.clear();
      navigate("/sign-in", { replace: true });
    }
  }, [error, navigate]);

  const onSignOut = async (): Promise<void> => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          navigate("/sign-in", { replace: true });
        },
      },
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Hello</CardTitle>
        <CardDescription>
          An authenticated round-trip to GET /api/hello.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Request failed"}
          </p>
        ) : (
          <p className="text-lg">{data?.message}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </CardFooter>
    </Card>
  );
};
