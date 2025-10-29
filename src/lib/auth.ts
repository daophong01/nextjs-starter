import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const isProd = (process.env.NEXTAUTH_URL || "").startsWith("https://");

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET, // explicit to avoid decryption mismatch
  providers: [
    // GitHub: hỗ trợ cả biến tên mới và cũ
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET || "",
    }),
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email & Mật khẩu",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email || "").toLowerCase().trim();
        const password = credentials?.password || "";
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        // Yêu cầu xác thực email trước khi đăng nhập bằng credentials
        if (!user.emailVerified) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name || undefined, role: (user as any).role || "user" } as any;
      },
    }),
  ],
  // Dùng JWT sessions để tránh phụ thuộc vào bảng Session khi DB gặp sự cố
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Khi đăng nhập, gắn role từ user vào token
      if (user) {
        // @ts-expect-error augment
        token.role = (user as any).role || "user";
      } else if (!token.role && token.email) {
        // nếu chưa có role trên token, thử lấy từ DB (best-effort)
        const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } }).catch(() => null);
        // @ts-expect-error augment
        token.role = (dbUser as any)?.role || token.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      // expose role on session from JWT token
      // @ts-expect-error augment
      session.user.role = (token as any).role || "user";
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};