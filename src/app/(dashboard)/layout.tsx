import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

// (dashboard) route group layout — adds sidebar nav
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    </div>
  );
}
