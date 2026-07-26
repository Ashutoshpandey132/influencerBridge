"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

export default function InfluencerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [influencer, setInfluencer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Decode role from cookie
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    if (match) {
      try {
        const payload = JSON.parse(atob(match[2].split(".")[1]));
        setRole(payload.role);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!params?.id) return;
    async function fetchInfluencer() {
      setLoading(true);
      try {
        const res = await fetch(`/api/influencers?limit=100`);
        const json = await res.json();
        if (json.success) {
          const found = json.data.items.find((inf: any) => inf._id === params.id);
          if (found) setInfluencer(found);
          else showToast("Influencer not found.", "error");
        }
      } catch {
        showToast("Failed to load profile.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchInfluencer();
  }, [params?.id]);

  function handleMessage() {
    const email = influencer?.userId?.email;
    if (!email) {
      showToast("No contact email available.", "error");
      return;
    }
    const name = influencer?.userId?.name || "there";
    const subject = encodeURIComponent("Collaboration Inquiry – InfluencerBridge");
    const body = encodeURIComponent(
      `Hi ${name},\n\nI found your profile on InfluencerBridge and I'd love to explore a potential collaboration.\n\nBest regards`
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`,
      "_blank"
    );
  }

  const formatFollowers = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num?.toString() ?? "0";
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div className="skeleton" style={{ height: 32, width: 160, marginBottom: "2rem", borderRadius: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
          <div className="glass skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div className="glass skeleton" style={{ height: 320, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div className="glass" style={{ padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Influencer not found</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            This profile may have been removed or the link is incorrect.
          </p>
          <Link href="/influencers">
            <button className="btn-primary">← Back to Discover</button>
          </Link>
        </div>
      </div>
    );
  }

  const user = influencer.userId || {};
  const { niche, followers, engagementRate, openToWork, bio, location, socialLinks } = influencer;

  const SOCIAL_ICONS: Record<string, string> = {
    instagram: "📸",
    youtube: "▶️",
    twitter: "🐦",
    tiktok: "🎵",
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Back */}
      <Link
        href="/influencers"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          textDecoration: "none",
          marginBottom: "1.75rem",
          fontWeight: 500,
          transition: "color 0.15s",
        }}
      >
        ← Back to Discover
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Left card: identity */}
        <div className="glass" style={{ padding: "2rem", textAlign: "center" }}>
          {/* Avatar */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2.5rem",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 4px 20px rgba(79,70,229,0.25)",
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
            {user.name || "Unknown"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            📍 {location?.city || "Unknown"}, {location?.state || "Unknown"}
          </p>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{niche}</span>
            {openToWork && <span className="badge badge-success">Open to Work</span>}
          </div>

          {/* Social Links */}
          {socialLinks && Object.keys(socialLinks).some((k) => !!(socialLinks as any)[k]) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.4rem 0.75rem",
                      borderRadius: 8,
                      background: "rgba(79,70,229,0.06)",
                      border: "1px solid rgba(79,70,229,0.15)",
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                  >
                    {SOCIAL_ICONS[platform] || "🔗"} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                );
              })}
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "0.7rem" }}
            onClick={handleMessage}
          >
            ✉️ Send Message
          </button>
        </div>

        {/* Right: stats + bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Stats */}
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1.25rem" }}>
              Performance Stats
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Followers", value: formatFollowers(followers), icon: "👥" },
                { label: "Engagement Rate", value: `${engagementRate}%`, icon: "📈" },
                { label: "Niche", value: niche?.charAt(0).toUpperCase() + niche?.slice(1), icon: "🎯" },
                { label: "Location", value: `${location?.city || "—"}, ${location?.state || "—"}`, icon: "📍" },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  style={{
                    padding: "1rem",
                    borderRadius: 12,
                    background: "rgba(0,0,0,0.02)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>{icon}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem", fontWeight: 600 }}>
                    {label}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
              About
            </h2>
            <p style={{ color: bio ? "var(--text-primary)" : "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, fontStyle: bio ? "normal" : "italic" }}>
              {bio || "This influencer hasn't added a bio yet."}
            </p>
          </div>

          {/* CTA for brands */}
          {role === "brand" && (
            <div
              className="glass"
              style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, rgba(79,70,229,0.04) 0%, rgba(124,58,237,0.04) 100%)",
                border: "1px solid rgba(79,70,229,0.15)",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Want to collaborate?
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Post a campaign and invite {user.name?.split(" ")[0] || "this influencer"} to apply, or reach out directly.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href="/campaigns">
                  <button className="btn-primary" style={{ fontSize: "0.875rem" }}>
                    Browse Campaigns
                  </button>
                </Link>
                <button className="btn-ghost" style={{ fontSize: "0.875rem" }} onClick={handleMessage}>
                  ✉️ Send Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
