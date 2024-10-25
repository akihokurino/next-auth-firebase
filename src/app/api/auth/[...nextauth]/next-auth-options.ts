import { adminAuth } from "@/infra/firebase/admin";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},

      authorize: async ({ idToken, refreshToken }: any) => {
        if (idToken && refreshToken) {
          try {
            const decoded = await adminAuth.verifyIdToken(idToken);

            // APIサーバーからユーザー情報を取得してそれを元にセッションを作成する

            return {
              id: decoded.user_id,
              uid: decoded.uid,
              idToken,
              refreshToken,
              tokenExpiryTime: decoded.exp || 0,
              type: "client",
            };
          } catch (err) {
            console.error(err);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.uid = user.id;
        token.idToken = user.idToken;
        token.refreshToken = user.refreshToken;
        token.tokenExpiryTime = user.tokenExpiryTime;
        token.type = user.type;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiryTime = token.tokenExpiryTime as number;
      const isExpired = currentTime > tokenExpiryTime - 60 * 5;
      if (isExpired) {
        try {
          const { idToken, newExpiryTime } = await fetchNewIdToken(
            token.refreshToken as string
          );
          token.idToken = idToken;
          token.tokenExpiryTime = newExpiryTime;
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.uid = token.uid;
      session.idToken = token.idToken || "";
      session.type = token.type;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// https://firebase.google.com/docs/reference/rest/auth?hl=ja#section-refresh-token
const fetchNewIdToken = async (refreshToken: string) => {
  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_TOKEN_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refreshToken,
      }),
    }
  );

  const { id_token, expires_in } = await res.json();
  const newExpiryTime = Math.floor(Date.now() / 1000) + parseInt(expires_in);

  return { idToken: id_token, newExpiryTime };
};

export type SessionType = "customer" | "client";
