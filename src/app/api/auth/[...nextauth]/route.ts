import { nextAuthOption } from "@/auth";
import NextAuth from "next-auth";

const handlers = NextAuth(nextAuthOption);

export { handlers as GET, handlers as POST };
