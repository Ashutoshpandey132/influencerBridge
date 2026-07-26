export interface FilterState {
  niche: string;
  city: string;
  state: string;
  minFollowers: string;
  openToWork: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string | boolean) => void;
}

const NICHES = [
  "Fashion",
  "Tech",
  "Fitness",
  "Food",
  "Travel",
  "Beauty",
  "Gaming",
  "Education",
  "Lifestyle",
  "Other"
];

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  return (
    <div
      className="glass"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        position: "sticky",
        top: "6rem",
        height: "fit-content",
      }}
    >
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
          Filters
        </h2>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          Niche
        </label>
        <select
          className="input"
          value={filters.niche}
          onChange={(e) => onChange("niche", e.target.value)}
        >
          <option value="">All Niches</option>
          {NICHES.map((niche) => (
            <option key={niche} value={niche.toLowerCase()}>
              {niche}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          City
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Los Angeles"
          value={filters.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          State / Province
        </label>
        <input
          type="text"
          className="input"
          placeholder="e.g. CA"
          value={filters.state}
          onChange={(e) => onChange("state", e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          Min. Followers
        </label>
        <select
          className="input"
          value={filters.minFollowers}
          onChange={(e) => onChange("minFollowers", e.target.value)}
        >
          <option value="">Any Size</option>
          <option value="5000">5k+</option>
          <option value="20000">20k+</option>
          <option value="100000">100k+</option>
          <option value="500000">500k+</option>
          <option value="1000000">1M+</option>
        </select>
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.9rem",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
            checked={filters.openToWork}
            onChange={(e) => onChange("openToWork", e.target.checked)}
          />
          Open to Work Only
        </label>
      </div>

      <button 
        className="btn-ghost" 
        style={{ marginTop: "1rem", width: "100%" }}
        onClick={() => {
          onChange("niche", "");
          onChange("city", "");
          onChange("state", "");
          onChange("minFollowers", "");
          onChange("openToWork", false);
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
