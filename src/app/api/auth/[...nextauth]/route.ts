import NextAuth from "next-auth";
import { auth } from "@/lib/server-auth";

const handler = NextAuth(auth);

export { handler as GET, handler as POST };