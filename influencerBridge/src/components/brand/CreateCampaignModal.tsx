"use client";

import { useState } from "react";
import { LocationScope, Niche } from "@/types";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NICHES: Niche[] = [
  "fashion", "tech", "fitness", "food", "travel", "beauty", "gaming", "education", "lifestyle", "other"
];

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [locationScope, setLocationScope] = useState<LocationScope>("national");
  const [targetNiches, setTargetNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          locationScope,
          targetNiches,
          status: "active"
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create campaign");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNicheToggle = (niche: Niche) => {
    if (targetNiches.includes(niche)) {
      setTargetNiches(targetNiches.filter(n => n !== niche));
    } else {
      setTargetNiches([...targetNiches, niche]);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "1rem"
    }}>
      <div className="glass" style={{
        width: "100%", maxWidth: 500, padding: "2rem",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
          Post a New Campaign
        </h2>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", padding: "0.75rem", borderRadius: 8, marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Campaign Title</label>
            <input required type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Tech Accessory Reals" />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Description & Deliverables</label>
            <textarea required className="input" style={{ minHeight: 100, resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what the influencer needs to do..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Budget (USD)</label>
              <input required type="number" min="0" className="input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 500" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Location Scope</label>
              <select className="input" value={locationScope} onChange={(e) => setLocationScope(e.target.value as LocationScope)}>
                <option value="local">Local</option>
                <option value="state">Statewide</option>
                <option value="national">National / Global</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Target Niches</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {NICHES.map(n => (
                <button
                  key={n} type="button"
                  onClick={() => handleNicheToggle(n)}
                  style={{
                    padding: "0.4rem 0.75rem", borderRadius: 20, border: "1px solid var(--border)", fontSize: "0.8rem", cursor: "pointer",
                    background: targetNiches.includes(n) ? "var(--accent)" : "white",
                    color: targetNiches.includes(n) ? "#fff" : "var(--text-secondary)",
                    transition: "all 0.15s",
                  }}
                >{n}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? "Posting..." : "Post Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
