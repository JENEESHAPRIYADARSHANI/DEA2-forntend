import { ReactNode } from "react";
import { UserHeader } from "./UserHeader";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container px-4 py-8">{children}</main>
    </div>
  );
}
