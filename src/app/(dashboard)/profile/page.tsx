"use client";

import { useState, useEffect } from "react";
import { Niche } from "@/types";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [niche, setNiche] = useState<Niche>("other");
  const [followers, setFollowers] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0);
  const [location, setLocation] = useState({ city: "", state: "", country: "" });
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [openToWork, setOpenToWork] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        const { user, profile } = json.data;
        setName(user.name);
        if (user.role === "influencer") {
          setNiche(profile.niche);
          setFollowers(profile.followers);
          setEngagementRate(profile.engagementRate);
          setLocation(profile.location || { city: "", state: "", country: "" });
          setBio(profile.bio || "");
          setOpenToWork(profile.openToWork);
        } else {
          setCompanyName(profile.companyName || "");
          setIndustry(profile.industry || "");
          setLocation(profile.location || { city: "", state: "", country: "" });
        }
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: any = { name, location };
      if (data.user.role === "influencer") {
        Object.assign(payload, { niche, followers, engagementRate, bio, openToWork });
      } else {
        Object.assign(payload, { companyName, industry });
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setEditMode(false);
        fetchProfile();
      } else {
        setError(json.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
         <div className="skeleton" style={{ height: 40, width: 200, marginBottom: "2rem" }} />
         <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.5rem" }}>
            <div className="glass skeleton" style={{ height: 300 }} />
            <div className="glass skeleton" style={{ height: 500 }} />
         </div>
      </div>
    );
  }

  const role = data?.user?.role;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          My Profile
        </h1>
        <button 
          className={editMode ? "btn-ghost" : "btn-primary"} 
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", padding: "1rem", borderRadius: 8, marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Avatar card */}
        <div className="glass" style={{ padding: "2rem", textAlign: "center" }}>
          <div
            style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
            }}
          >
            {role === "influencer" ? "🎬" : "🏢"}
          </div>
          
          {editMode ? (
            <div style={{ textAlign: "left" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Display Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
              {role === "brand" && (
                <div style={{ marginTop: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Company Name</label>
                  <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{role === "brand" ? companyName : name}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                {data.user.email}
              </div>
              <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{role}</span>
            </>
          )}

          {editMode && (
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1.5rem" }} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        {/* Details Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "0.95rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Profile Details
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {role === "influencer" ? (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>NICHE</label>
                    {editMode ? (
                      <select className="input" value={niche} onChange={e => setNiche(e.target.value as Niche)}>
                        {["fashion","tech","fitness","food","travel","beauty","gaming","education","lifestyle","other"].map(n => (
                          <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
                        ))}
                      </select>
                    ) : <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{niche}</div>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>FOLLOWERS</label>
                    {editMode ? (
                      <input type="number" className="input" value={followers} onChange={e => setFollowers(Number(e.target.value))} />
                    ) : <div style={{ fontWeight: 600 }}>{followers.toLocaleString()}</div>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>ENGAGEMENT RATE (%)</label>
                    {editMode ? (
                      <input type="number" step="0.1" className="input" value={engagementRate} onChange={e => setEngagementRate(Number(e.target.value))} />
                    ) : <div style={{ fontWeight: 600 }}>{engagementRate}%</div>}
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>INDUSTRY</label>
                  {editMode ? (
                    <input className="input" value={industry} onChange={e => setIndustry(e.target.value)} required />
                  ) : <div style={{ fontWeight: 600 }}>{industry}</div>}
                </div>
              )}
              
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>LOCATION</label>
                {editMode ? (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input placeholder="City" className="input" value={location.city} onChange={e => setLocation({...location, city: e.target.value})} />
                    <input placeholder="State" className="input" value={location.state} onChange={e => setLocation({...location, state: e.target.value})} />
                  </div>
                ) : <div style={{ fontWeight: 600 }}>{location.city}, {location.state}</div>}
              </div>
            </div>

            {(role === "influencer" || editMode) && (
              <div style={{ marginTop: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>BIO</label>
                {editMode ? (
                  <textarea className="input" style={{ minHeight: 100, resize: "vertical" }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
                ) : <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>{bio || "No bio added yet."}</p>}
              </div>
            )}
          </div>

          {role === "influencer" && (
            <div className="glass" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Open to Work</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Signal to brands that you're available for campaigns.
                  </div>
                </div>
                <div 
                  onClick={() => editMode && setOpenToWork(!openToWork)}
                  style={{
                    width: 48, height: 28, borderRadius: 99,
                    background: openToWork ? "var(--success)" : "var(--border)",
                    cursor: editMode ? "pointer" : "default",
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 4, left: openToWork ? 24 : 4,
                    transition: "all 0.2s"
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
