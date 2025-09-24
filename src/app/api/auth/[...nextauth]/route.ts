import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { apiServices } from "@/src/services/api";

type ApiUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type StdSuccess = {
  status: "success";
  token: string;
  data: { user: ApiUser };
};

type StdFailure = {
  status: "fail" | "error";
  message?: string;
  statusMsg?: string;
};

type AltSuccess = {
  message: string;
  token: string;
  user: ApiUser;
  status?: unknown;
  statusMsg?: string;
};

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

function isStdSuccess(val: unknown): val is StdSuccess {
  return (
    isRecord(val) &&
    val.status === "success" &&
    typeof val.token === "string" &&
    isRecord(val.data) &&
    isRecord((val.data as Record<string, unknown>).user)
  );
}

function isStdFailure(val: unknown): val is StdFailure {
  return isRecord(val) && (val.status === "fail" || val.status === "error");
}

function isAltSuccess(val: unknown): val is AltSuccess {
  return (
    isRecord(val) &&
    typeof val.message === "string" &&
    typeof val.token === "string" &&
    isRecord((val.user as unknown))
  );
}

function hasAccessToken(u: unknown): u is User & { accessToken: string; role?: string } {
  return isRecord(u) && typeof (u as Record<string, unknown>).accessToken === "string";
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password", placeholder: "**********" }
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim() ?? "";
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          const resp: unknown = await apiServices.login(email, password);

          if (isStdSuccess(resp)) {
            const apiUser = resp.data.user;
            const user: User & { accessToken: string; role?: string } = {
              id: String(apiUser._id ?? apiUser.id ?? apiUser.email ?? "unknown"),
              name: apiUser.name ?? "",
              email: apiUser.email ?? "",
              accessToken: resp.token,
              role: apiUser.role ?? "user"
            };
            return user;
          }

          if (isAltSuccess(resp)) {
            const apiUser = resp.user;
            const user: User & { accessToken: string; role?: string } = {
              id: String(apiUser.email ?? apiUser._id ?? apiUser.id ?? "unknown"),
              name: apiUser.name ?? "",
              email: apiUser.email ?? "",
              accessToken: resp.token,
              role: apiUser.role ?? "user"
            };
            return user;
          }

          if (isStdFailure(resp)) {
            return null;
          }

          return null;
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user && hasAccessToken(user)) {
        token.accessToken = user.accessToken;
        if (user.role) token.role = user.role;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      (session as Session & { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? session.user.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

