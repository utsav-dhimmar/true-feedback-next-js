import type { NextAuthOptions } from "next-auth";
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
						console.log("from authorize", user);
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
			// console.log("start of jwt ", "token:- ", token, "user:- ", user);
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			// console.log(
			// 	"End of jwt After storing values in token",
			// 	"user:- ",
			// 	user,
			// 	"token:- ",
			// 	token,
			// );
			return token;
		},
		async session({ session, token }) {
			// console.log(
			// 	"Start of session",
			// 	"session:- ",
			// 	session,
			// 	"token:- ",
			// 	token,
			// );
			if (token) {
				session.user._id = token._id?.toString();
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.isVerified = token.isVerified;
				session.user.username = token.username;
			}
			// console.log(
			// 	"End of session After storing values in session",
			// 	"session:- ",
			// 	session,
			// 	"token:- ",
			// 	token,
			// );
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET!,
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	logger: {
		error(code, metadata) {
			console.error("error", code, metadata);
		},
		warn(code) {
			console.warn("warn", code);
		},
		debug(code, metadata) {
			console.debug("debug", code, metadata);
		},
	},
};
