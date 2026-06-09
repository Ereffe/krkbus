import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
