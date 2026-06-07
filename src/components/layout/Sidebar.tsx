"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: "⬛" },
  { href: "/influencers", label: "Discover", icon: "🔍" },
  { href: "/campaigns", label: "Campaigns", icon: "📣" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        background: "rgba(248, 250, 252, 0.5)",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "var(--text-muted)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          padding: "0 0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        Navigation
      </div>

      {LINKS.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              fontSize: "0.875rem",
              fontWeight: active ? 600 : 400,
              color: active ? "var(--accent)" : "var(--text-secondary)",
              background: active ? "rgba(79, 70, 229, 0.08)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
              borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            <span style={{ fontSize: "1rem" }}>{icon}</span>
            {label}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
        <button
          className="btn-ghost"
          style={{ width: "100%", justifyContent: "flex-start", display: "flex", gap: "0.5rem", padding: "0.5rem 0.75rem" }}
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}
