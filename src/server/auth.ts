/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { DefaultSession } from "next-auth";

import { env } from "~/env.mjs";
import { prisma } from "./db";


export const authOptions: NextAuthOptions = {
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.userNo = user.userNo
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id  = token.id
        session.user.userNo = token.userNo
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        userNo: {
          label: "userNo",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const cred = credentials!

        const user = await prisma.user.findFirst({
          where: { userNo: cred.userNo },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = bcrypt.compareSync(
          cred.password,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          password: user.password,
          userNo: user.userNo,
        }
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
