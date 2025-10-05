import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        });

        return {
          id: user.id,
          email: user?.email,
          phone: user?.phone,
          name: user.name,
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
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});
