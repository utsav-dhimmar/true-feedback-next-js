import { nextOption } from "@/auth";
import NextAuth from "next-auth";

const handlers = NextAuth(nextOption);

export { handlers as GET, handlers as POST };
