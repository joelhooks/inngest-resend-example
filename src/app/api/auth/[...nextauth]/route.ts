import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import { type NextApiHandler } from "next";

const handler = NextAuth(authOptions) as NextApiHandler;

export { handler as GET, handler as POST };
