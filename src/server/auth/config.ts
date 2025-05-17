import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"; // For password hashing

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>> | undefined,
        req,
      ) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email
            : undefined;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : undefined;
        if (!email || !password) return null;
        // Find user by email
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.email || !user.password) return null;
        // Compare password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
