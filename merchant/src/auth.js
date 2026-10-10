import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        // The password is verified here and nowhere else: the credentials
        // endpoint is reachable directly, so a check in the login action alone
        // is not a check at all.
        const identifier = String(credentials?.identifier || "").trim();
        const password = String(credentials?.password || "");
        if (!identifier || !password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier.toLowerCase() }, { phone: identifier }],
          },
          include: {
            addresses: true,
          },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        const defaultAddress = user.addresses[0];

        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          profileImage: user?.profileImage || null, // ✅ from UserAddress
        };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session: { strategy: "jwt" },

  // callbacks: {
  //   jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.profileImage = user.profileImage;
  //     }
  //     return token;
  //   },

  //   session({ session, token }) {
  //     session.user.id = token.id;
  //     session.user.profileImage = token.profileImage;
  //     return session;
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, NextAuth passes `user`
      if (user) {
        token.id = user.id;
        // if you already have profileImage on sign in, set it
        token.profileImage = user.profileImage ?? token.profileImage;
        return token;
      }

      // For subsequent requests, token exists — fetch latest from DB
      if (token?.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            include: { addresses: true },
          });

          token.profileImage = dbUser?.profileImage;
        } catch (err) {
          console.error("Failed to refresh profileImage in jwt callback", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.profileImage = token.profileImage;
      return session;
    },
  },
});
