import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDB from "./db/dbConnect";
import Users from "./model/users.model";
import { comparePassword } from "./utils/bcrypt";

export const nextAuthOption: NextAuthOptions = {
	providers: [
		// Google
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		// Custome
		CredentialsProvider({
			id: "Credentials",
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Enter Email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Enter Password",
				},
			},
			async authorize(credentials, request) {
				const email = credentials?.email;
				const password = credentials?.password || "";
				try {
					await connectToDB();
					const user = await Users.findOne({
						email: email,
					});
					console.log(user);
					if (!user) {
						throw new Error("User not found with this email");
					}
					if (!user.isVerified) {
						throw new Error("Please Verify Before login");
					}
					const isCorrectPassword = await comparePassword(
						password,
						user.password,
					);
					if (!isCorrectPassword) {
						throw new Error("Invalid Credentials");
					} else {
						return user;
					}
				} catch (error: any) {
					console.log("Error ", error);
					throw new Error(error.message || "Somthing went wrong");
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
			}
			return token;
		},
		async session({ session, user }) {
			if (user) {
				session.user._id = user._id;
				session.user.isAcceptingMessages = user.isAcceptingMessages;
				session.user.isVerified = user.isVerified;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
	pages: {
		signIn: "/signin",
	},
	session: {
		strategy: "jwt",
	},
};
