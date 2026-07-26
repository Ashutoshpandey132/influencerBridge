import type { ReactNode } from "react";

// (auth) route group layout — no extra chrome, just centered content
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
