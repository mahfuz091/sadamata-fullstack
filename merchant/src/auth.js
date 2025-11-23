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
            addresses: {
              where: { isDefault: true },
              take: 1,
            },
          },
        });

        if (!user) return null;

        const defaultAddress = user.addresses[0];

        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          profileImage: defaultAddress?.profileImage || null, // ✅ from UserAddress
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.profileImage = token.profileImage;
      return session;
    },
  },
});
