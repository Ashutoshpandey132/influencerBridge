import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InfluencerBridge – Connect Brands & Influencers",
};

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79, 70, 229, 0.08) 0%, transparent 70%), var(--gradient-hero)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(79, 70, 229, 0.04)",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "0%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "rgba(14, 165, 233, 0.04)",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 760 }}>
          <span
            className="badge badge-accent"
            style={{ marginBottom: "1.5rem", display: "inline-flex" }}
          >
            🚀 Now in beta — join 500+ creators
          </span>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: "1.5rem",
            }}
          >
            <span className="gradient-text">Bridge the gap</span>
            <br />
            between brands &amp; influencers
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Discover location-based influencers, post campaigns, and collaborate—all in one platform built for modern marketing.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register">
              <button className="btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Get Started Free
              </button>
            </Link>
            <Link href="/influencers">
              <button className="btn-ghost" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Discover Influencers →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            { value: "10K+", label: "Influencers" },
            { value: "2K+", label: "Active Brands" },
            { value: "5K+", label: "Campaigns Launched" },
            { value: "98%", label: "Match Satisfaction" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="glass"
              style={{ padding: "2rem", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
                className="gradient-text"
              >
                {value}
              </div>
              <div style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 1.5rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "3rem",
          }}
        >
          Everything you need to collaborate
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: "📍",
              title: "Location-Based Discovery",
              desc: "Find influencers in your city, state, or nationwide. Filter by niche, follower count, and engagement.",
            },
            {
              icon: "📣",
              title: "Campaign Management",
              desc: "Post campaigns with budgets, scopes, and target niches. Manage applications from a clean dashboard.",
            },
            {
              icon: "🤝",
              title: "Apply & Accept System",
              desc: "Influencers apply to campaigns. Brands review, accept, or reject — all within the platform.",
            },
            {
              icon: "🔓",
              title: "Open to Work Toggle",
              desc: "Influencers signal availability instantly. Brands can filter for those actively seeking collabs.",
            },
            {
              icon: "🔐",
              title: "Secure JWT Auth",
              desc: "Role-based access for brands and influencers with secure token authentication.",
            },
            {
              icon: "📊",
              title: "Analytics Ready",
              desc: "Track campaign performance, application rates, and engagement metrics. Redis caching coming soon.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass"
              style={{ padding: "1.75rem", transition: "all 0.25s" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.875rem" }}>{icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1rem" }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Ready to start collaborating?
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Join thousands of brands and influencers already on the platform.
        </p>
        <Link href="/register">
          <button className="btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 2.5rem" }}>
            Join InfluencerBridge →
          </button>
        </Link>
      </section>
    </div>
  );
}
