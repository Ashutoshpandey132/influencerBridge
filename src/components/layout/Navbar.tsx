"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/influencers", label: "Discover" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [isLoggerIn, setIsLoggedIn] = useState(false);

  // Sync client cookie to determine auth UI
  useEffect(() => {
    setIsClient(true);
    const token = document.cookie.match(/(^| )token=([^;]+)/);
    setIsLoggedIn(!!token);
  }, [pathname]);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em" }}
            className="gradient-text"
          >
            Influencer<span style={{ color: "#6366f1" }}>Bridge</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: 8,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: pathname.startsWith(href) ? "var(--accent)" : "var(--text-secondary)",
                background: pathname.startsWith(href) ? "rgba(79, 70, 229, 0.06)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {isClient && isLoggerIn ? (
            <button 
              className="btn-ghost" 
              style={{ padding: "0.45rem 1rem" }}
              onClick={() => {
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                window.location.href = "/login";
              }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="btn-ghost" style={{ padding: "0.45rem 1rem" }}>
                  Log in
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: "0.45rem 1rem" }}>
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
