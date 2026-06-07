"use client";

import { useState, useEffect } from "react";
import { ICampaign, LocationScope, Niche } from "@/types";
import ApplyModal from "@/components/influencer/ApplyModal";
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

export default function CampaignsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [locationScope, setLocationScope] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [page, setPage] = useState(1);
  
  // Modal State
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRoleFromCookie());
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (locationScope) params.set("locationScope", locationScope);
      if (minBudget) params.set("minBudget", minBudget);

      const res = await fetch(`/api/campaigns?${params.toString()}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [locationScope, minBudget, page]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          Active Campaigns
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Browse brand integrations and apply as an influencer.
        </p>
      </div>

      {/* Filters */}
      <div className="glass" style={{
        padding: "1.25rem 1.5rem", marginBottom: "2rem",
        display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center"
      }}>
        <select className="input" style={{ maxWidth: 200 }} value={locationScope} onChange={e => {setLocationScope(e.target.value); setPage(1);}}>
          <option value="">All Scopes</option>
          <option value="local">Local</option>
          <option value="state">Statewide</option>
          <option value="national">National / Global</option>
        </select>
        <select className="input" style={{ maxWidth: 200 }} value={minBudget} onChange={e => {setMinBudget(e.target.value); setPage(1);}}>
          <option value="">Any Budget</option>
          <option value="100">₹100+</option>
          <option value="500">₹500+</option>
          <option value="1000">₹1,000+</option>
          <option value="5000">₹5,000+</option>
        </select>
        
        {(locationScope || minBudget) && (
           <button className="btn-ghost" onClick={() => { setLocationScope(""); setMinBudget(""); setPage(1); }}>
             Clear
           </button>
        )}
      </div>

      {/* Campaign List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass skeleton" style={{ height: 160, borderRadius: 12 }}></div>
          ))
        ) : data?.items?.length > 0 ? (
          <>
            {data.items.map((campaign: ICampaign) => {
              const brand = campaign.brandId as any;
              return (
                <div key={campaign._id} className="glass" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                    background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", color: "var(--accent)", fontWeight: 800
                  }}>
                    {brand?.companyName ? brand.companyName.charAt(0).toUpperCase() : "B"}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>{campaign.title}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                      {brand?.companyName} • {brand?.industry} • {campaign.locationScope}
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.5 }}>
                      {campaign.description}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {campaign.targetNiches?.map(n => (
                        <span key={n} className="badge badge-accent">{n}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", minWidth: 150 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Budget</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--success)" }}>${campaign.budget}</div>
                    </div>
                    {role === "influencer" && (
                      <button className="btn-primary" onClick={() => setSelectedCampaign(campaign)}>
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {data.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
                <button className="btn-ghost" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Page {data.page} of {data.totalPages}</span>
                <button className="btn-ghost" onClick={() => setPage(page + 1)} disabled={page === data.totalPages}>Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
             <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No active campaigns</h3>
             <p style={{ color: "var(--text-secondary)" }}>Try modifying your filters.</p>
          </div>
        )}
      </div>

      <ApplyModal 
        campaign={selectedCampaign} 
        onClose={() => setSelectedCampaign(null)}
        onSuccess={() => showToast("Application submitted! The brand will review it soon. 🎉", "success")}
      />
    </div>
  );
}
