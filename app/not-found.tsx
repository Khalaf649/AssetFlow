import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg font-semibold text-foreground">
            Page not found
          </p>
          <p className="text-sm text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 text-sm font-medium transition-colors h-9 px-4 py-2 w-full"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors h-9 px-4 py-2 w-full"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
