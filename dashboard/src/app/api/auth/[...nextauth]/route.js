// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const options = {
  // use NEXTAUTH_SECRET (set that in cPanel env)
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/", // fine
  },
  session: { strategy: "jwt" },
  // trust proxy / host headers if you're behind a proxy (cPanel)
  trustHost: process.env.AUTH_TRUST_HOST === "true" || false,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.profileImage = token.profileImage;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
};

// create the handler and export for App Router
const handler = NextAuth(options);
export { handler as GET, handler as POST };
