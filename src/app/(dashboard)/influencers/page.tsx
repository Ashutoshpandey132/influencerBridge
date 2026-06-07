"use client";

import { useState, useEffect } from "react";
import FilterSidebar, { FilterState } from "@/components/influencer/FilterSidebar";
import InfluencerCard from "@/components/influencer/InfluencerCard";

export default function InfluencersPage() {
  const [filters, setFilters] = useState<FilterState>({
    niche: "",
    city: "",
    state: "",
    minFollowers: "",
    openToWork: false,
  });

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (filters.niche) params.set("niche", filters.niche);
      if (filters.city) params.set("city", filters.city);
      if (filters.state) params.set("state", filters.state);
      if (filters.minFollowers) params.set("minFollowers", filters.minFollowers);
      if (filters.openToWork) params.set("openToWork", "true");

      const res = await fetch(`/api/influencers?${params.toString()}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Failed to fetch influencers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [filters, page]);

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter change
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          Discover Influencers
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Browse creators by niche, location, and audience size.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          alignItems: "start",
        }}
        className="influencer-grid"
      >
        <div style={{ display: "none", "@media (min-width: 900px)": { display: "block" } } as any} className="sidebar-container">
           {/* We will handle responsive CSS with globals or inline. For inline standard: */}
           <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
             <div
             style={{
               display: "grid",
               gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
               gap: "1.25rem",
             }}
           >
             {Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="glass skeleton" style={{ height: 260, borderRadius: 12 }}></div>
             ))}
           </div>
          ) : data?.items?.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {data.items.map((influencer: any) => (
                  <InfluencerCard key={influencer._id} influencer={influencer} />
                ))}
              </div>
              
              {data.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Page {data.page} of {data.totalPages}
                  </span>
                  <button 
                    className="btn-ghost" 
                    onClick={() => setPage(page + 1)} 
                    disabled={page === data.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No influencers found</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Try adjusting your filters to find more creators.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .influencer-grid {
          grid-template-columns: 1fr;
        }
        .sidebar-container {
          display: block; /* Typically stacked on mobile */
          margin-bottom: 2rem;
        }
        @media (min-width: 900px) {
          .influencer-grid {
            grid-template-columns: 280px 1fr;
          }
          .sidebar-container {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
