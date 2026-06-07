import { SignJWT, jwtVerify } from "jose";
import { JwtPayload, AuthUser } from "@/types";

function getSecretKey() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "ashutosh123"
  );
}

export async function signToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as unknown as JwtPayload;
}
