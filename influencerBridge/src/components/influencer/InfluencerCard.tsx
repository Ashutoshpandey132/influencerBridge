"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface InfluencerCardProps {
  influencer: any;
}

export default function InfluencerCard({ influencer }: InfluencerCardProps) {
  const { userId, location, niche, followers, engagementRate, openToWork, _id } = influencer;
  const user = userId || {};
  const router = useRouter();
  const { showToast } = useToast();

  // Formats large numbers like 120000 to "120K"
  const formatFollowers = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  function handleMessage() {
    const email = user.email;
    if (!email) {
      showToast("No email address found for this influencer.", "error");
      return;
    }
    const subject = encodeURIComponent("Collaboration Inquiry – InfluencerBridge");
    const body = encodeURIComponent(
      `Hi ${user.name || "there"},\n\nI found your profile on InfluencerBridge and would love to discuss a potential collaboration.\n\nBest regards`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`, "_blank");
  }

  return (
    <div
      className="glass"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "1.5rem",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name || "Unknown User"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "0.15rem 0 0.5rem" }}>
            📍 {location?.city || "Unknown"}, {location?.state || "Unknown"}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge badge-accent">{niche}</span>
            {openToWork && <span className="badge badge-success">Open to Work</span>}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.02)",
          padding: "0.875rem",
          borderRadius: 10,
          marginTop: "auto",
          border: "1px solid var(--border)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem", fontWeight: 600 }}>
            Followers
          </div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>
            {formatFollowers(followers)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem", fontWeight: 600 }}>
            Engagement
          </div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>
            {engagementRate}%
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <button
          className="btn-primary"
          style={{ padding: "0.6rem", fontSize: "0.85rem" }}
          onClick={() => router.push(`/influencers/${_id}`)}
        >
          View Profile
        </button>
        <button
          className="btn-ghost"
          style={{ padding: "0.6rem", fontSize: "0.85rem" }}
          onClick={handleMessage}
        >
          Message
        </button>
      </div>
    </div>
  );
}
