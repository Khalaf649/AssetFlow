import { AuthProvider } from "@/app/auth/context/AuthContext";
import { TanStackQueryProvider } from "@/app/providers/TanStackQueryProvider";
import { Toaster } from "@/src/components/ui/sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <TanStackQueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
