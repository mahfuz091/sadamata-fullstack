import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

const normalizeIdentifier = (value) => {
  const identifier = String(value || "").trim();
  return identifier.includes("@") ? identifier.toLowerCase() : identifier;
};

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
        const identifier = normalizeIdentifier(credentials?.identifier);

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone: identifier }],
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
          profileImage: user?.profileImage || null,
        };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage ?? token.profileImage;
        return token;
      }

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
