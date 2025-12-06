import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

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
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
          include: {
            addresses: true,
          },
        });

        if (!user) return null;

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
    signIn: "/login",
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

          const latestImage =
            dbUser?.addresses?.[0]?.profileImage ?? token.profileImage;
          token.profileImage = dbUser?.profileImage ?? latestImage;
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
