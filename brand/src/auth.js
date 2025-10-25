// auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET, // অথবা NEXTAUTH_SECRET
  providers: [
    Credentials({
      credentials: { identifier: {}, password: {} },
      authorize: async (credentials) => {
        const identifier = credentials?.identifier || "";
        const password = credentials?.password || "";

        // ইউজার খোঁজা (email বা phone)
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { phone: identifier }] },
        });

        // না পেলে বা পাসওয়ার্ড ম্যাচ না করলে null
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // রোল/অ্যাক্টিভিটি চেক
        if (user.role !== "BRAND" || !user.isActive) return null;

        // মিনিমাল প্রোফাইল রিটার্ন
        return {
          id: user.id,
          email: user.email || "",
          name: user.name || "",
          phone: user.phone || "",
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (!session.user) session.user = {};
      session.user.id = token.id;
      return session;
    },
  },
});
