import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth, update } = NextAuth({
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
              { email: credentials.identifier.toLowerCase() },
              { phone: credentials.identifier },
            ],
          },
        });

        return {
          id: user.id,
          email: user?.email,
          phone: user?.phone,
          name: user.name,
          profileImage: user.profileImage,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 86400 },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage;
      }
      if (trigger === "update" && session?.user?.profileImage !== undefined) {
        token.profileImage = session.user.profileImage;
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
