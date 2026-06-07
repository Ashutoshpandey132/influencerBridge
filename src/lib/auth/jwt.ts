import { SignJWT, jwtVerify } from "jose";
import { JwtPayload, AuthUser } from "@/types";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-this-secret-in-production"
);

export async function signToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as JwtPayload;
}
