"use client";

import { useState, useEffect } from "react";
import CreateCampaignModal from "@/components/brand/CreateCampaignModal";
import { useToast } from "@/components/ui/Toast";

function getRoleFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  if (!match) return null;
  try {
    const payload = JSON.parse(atob(match[2].split('.')[1]));
    return payload.role;
  } catch (e) {
    return null;
  }
}

export default function DashboardPage() {
  const { showToast } = useToast();
  const [role, setRole] = useState<string | null>(null);
  const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
  
  // Data States
  const [applications, setApplications] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]); // Primarily for Brands to see their stats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = getRoleFromCookie();
    setRole(userRole);
    if (userRole) {
      fetchDashboardData(userRole);
    }
  }, []);

  const fetchDashboardData = async (userRole: string) => {
    setLoading(true);
    try {
      // Both Brands and Influencers need applications (Brands: received, Influencer: sent)
      const appRes = await fetch("/api/applications?limit=50");
      const appJson = await appRes.json();
      if (appJson.success) setApplications(appJson.data.items || []);

      // If playing as Brand, it might help to fetch their campaigns directly later, 
      // but for MVP we rely on the applications populate to construct their reality or just show apps
      // If we wanted to fetch their own campaigns, we would need a dedicated endpoint, 
      // but our /api/campaigns is currently public filtering active only. 
      // We will skip dedicated brand campaign list and just show Applications to them for now.
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setApplications(apps => apps.map(a => a._id === appId ? { ...a, status } : a));
      } else {
        alert(json.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const acceptedCount = applications.filter(a => a.status === "accepted").length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            {role === "brand" ? "Manage your brand campaigns & applicants." : "Track your campaign applications."}
          </p>
        </div>
        
        {role === "brand" && (
          <button className="btn-primary" onClick={() => setCampaignModalOpen(true)}>
            + Post Campaign
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>📥</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }} className="gradient-text">
            {applications.length || 0}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Total Applications {role === "brand" ? "Received" : "Sent"}
          </div>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>⏳</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }} className="gradient-text">
            {pendingCount}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Pending Action</div>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>✅</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }} className="gradient-text">
            {acceptedCount}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Accepted</div>
        </div>
      </div>

      <div className="glass" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
          {role === "brand" ? "Applications to Your Campaigns" : "Your Applications"}
        </h2>

        {loading ? (
          <div>Loading workspace...</div>
        ) : applications.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {role === "brand" ? "No one has applied to your campaigns yet." : "You haven't applied to any campaigns yet. Head over to Active Campaigns to browse."}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {applications.map(app => {
              const camp = app.campaignId;
              const inf = app.influencerId;
              const infUser = inf?.userId;

              return (
                <div key={app._id} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: 10, display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontWeight: 700, margin: "0 0 0.25rem 0" }}>{camp?.title}</h3>
                    
                    {role === "brand" ? (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                        Applied by <strong>{infUser?.name || "Influencer"}</strong> • {inf?.niche} • {inf?.followers} Followers
                      </p>
                    ) : (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                        Budget: ${camp?.budget} • Scope: {camp?.locationScope}
                      </p>
                    )}
                    
                    {app.message && (
                      <div style={{ fontSize: "0.85rem", marginTop: "0.75rem", padding: "0.75rem", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border)", borderRadius: 6, fontStyle: "italic", color: "var(--text-secondary)" }}>
                        &ldquo;{app.message}&rdquo;
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span className={`badge ${app.status === 'accepted' ? 'badge-success' : app.status === 'rejected' ? 'badge-warning' : 'badge-accent'}`}>
                      {app.status.toUpperCase()}
                    </span>
                    
                    {role === "brand" && app.status === "pending" && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => handleUpdateStatus(app._id, "accepted")}>Accept</button>
                        <button className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => handleUpdateStatus(app._id, "rejected")}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateCampaignModal 
        isOpen={isCampaignModalOpen} 
        onClose={() => setCampaignModalOpen(false)} 
        onSuccess={() => {
          if (role) fetchDashboardData(role);
          showToast("Campaign successfully posted! 🎉", "success");
        }}
      />
    </div>
  );
}
