import { SessionType } from "@/app/api/auth/[...nextauth]/next-auth-options";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    uid?: string;
    idToken?: string;
    type: SessionType;
  }

  interface User extends DefaultUser {
    idToken?: string;
    refreshToken?: string;
    tokenExpiryTime?: number;
    type: SessionType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    uid?: string;
    idToken?: string;
    refreshToken?: string;
    tokenExpiryTime?: number;
    type: SessionType;
  }
}
