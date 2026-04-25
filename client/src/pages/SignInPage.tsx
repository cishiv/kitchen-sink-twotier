import { Link, Navigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/features/auth/SignInForm";
import { useSession } from "@/features/auth/useSession";

export const SignInPage = (): React.ReactElement => {
  const { data, isPending } = useSession();

  if (!isPending && data) return <Navigate to="/" replace />;

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your Fabric account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <p className="text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link to="/sign-up" className="font-medium text-primary underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
