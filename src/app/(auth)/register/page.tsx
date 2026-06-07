"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"influencer" | "brand">("influencer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      document.cookie = `token=${data.data.token}; path=/; max-age=604800; SameSite=Lax; Secure`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        background:
          "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
      }}
    >
      <div className="glass" style={{ width: "100%", maxWidth: 460, padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Join InfluencerBridge
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Create your free account in seconds
          </p>
        </div>

        {/* Role toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            background: "rgba(0,0,0,0.04)",
            borderRadius: 10,
            padding: 4,
            marginBottom: "1.5rem",
          }}
        >
          {["Influencer", "Brand"].map((r) => {
            const currentRole = r.toLowerCase() as "influencer" | "brand";
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(currentRole)}
                id={`role-${currentRole}`}
                style={{
                  padding: "0.6rem",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  background: role === currentRole ? "var(--accent)" : "transparent",
                  color: role === currentRole ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {currentRole === "influencer" ? "🎬 " : "🏢 "}
                {r}
              </button>
            );
          })}
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit}>
          {error && <div style={{ color: "var(--danger)", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: 4 }}>{error}</div>}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>
              Full Name
            </label>
            <input id="register-name" type="text" className="input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>
              Email
            </label>
            <input id="register-email" type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>
              Password
            </label>
            <input id="register-password" type="password" className="input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
