// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = "influencer" | "brand";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Influencer ───────────────────────────────────────────────────────────────
export type Niche =
  | "fashion"
  | "tech"
  | "fitness"
  | "food"
  | "travel"
  | "beauty"
  | "gaming"
  | "education"
  | "lifestyle"
  | "other";

export interface ILocation {
  city: string;
  state: string;
  country: string;
}

export interface IInfluencer {
  _id: string;
  userId: string | IUser;
  niche: Niche;
  followers: number;
  engagementRate: number; // percentage e.g. 4.5
  location: ILocation;
  openToWork: boolean;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Brand ───────────────────────────────────────────────────────────────────
export interface IBrand {
  _id: string;
  userId: string | IUser;
  companyName: string;
  industry: string;
  location: ILocation;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Campaign ────────────────────────────────────────────────────────────────
export type LocationScope = "local" | "state" | "national";
export type CampaignStatus = "draft" | "active" | "closed";

export interface ICampaign {
  _id: string;
  title: string;
  description: string;
  budget: number;
  locationScope: LocationScope;
  brandId: string | IBrand;
  targetNiches?: Niche[];
  minFollowers?: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Application ─────────────────────────────────────────────────────────────
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface IApplication {
  _id: string;
  influencerId: string | IInfluencer;
  campaignId: string | ICampaign;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload extends AuthUser {
  iat: number;
  exp: number;
}
