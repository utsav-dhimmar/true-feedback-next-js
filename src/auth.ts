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
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
					}).select("+password");
					if (!user) {
						throw new Error("User not found with this email");
					}
					if (!user.isVerified) {
						throw new Error("Please Verify Before login");
					}
					const isCorrectPassword = await comparePassword(
						password,
						user.password as string,
					);
					if (!isCorrectPassword) {
						throw new Error("Invalid Credentials");
					}
					// console.log("from authorize", user);
					return {
						id: String(user._id),
						_id: String(user._id),
						email: user.email,
						username: user.username,
						isVerified: user.isVerified,
						isAcceptingMessages: user.isAcceptingMessages,
					};
				} catch (error: any) {
					console.log("Error ", error);
					throw new Error(
						error.message ||
						"Somthing went wrong in authentication",
					);
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {

			if (account?.provider === "google") {
				try {
					await connectToDB();
					const existingUser = await Users.findOne({
						email: user.email,
					});


					// if user already exist in db so just store their values in user parameter

					if (existingUser) {
						user.username = existingUser.username;
						user._id = existingUser._id as string;
						user.isVerified = existingUser.isVerified;
						user.isAcceptingMessages =
							existingUser.isAcceptingMessages;
						return true;
					}

					// may be gmail username already taken, 
					// add appernd some random number 
					// do not have user name constrcut it with just random number

					const username =
						profile?.name?.replaceAll(" ", "") ||
						`user${Math.floor(Math.random() * 100000)}`;



					let newUsername = username;
					// find user with username
					let userWithUsername = await Users.findOne({
						username: newUsername,
					});


					// if user with username already exists than just, try with random number

					while (userWithUsername) {
						newUsername =
							username + Math.floor(Math.random() * 10000);
						userWithUsername = await Users.findOne({
							username: newUsername,
						});
					}

					const newUser = await Users.create({
						username: newUsername,
						email: user.email,
						isVerified: true,
						isAcceptingMessages: true,
					});

					user.username = newUser.username;
					user._id = newUser._id as string;
					user.isVerified = newUser.isVerified;
					user.isAcceptingMessages = newUser.isAcceptingMessages;


					return true;
				} catch (error) {
					console.log("Error during google sign in", error);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (account?.provider === "google" && user) {
				try {
					await connectToDB();
					let dbUser = await Users.findOne({ email: user.email });
					if (!dbUser) {
						const username =
							user?.name?.replaceAll(" ", "") ||
							`user${Math.floor(Math.random() * 100000)}`;

						let newUsername = username;
						let userWithUsername = await Users.findOne({
							username: newUsername,
						});
						while (userWithUsername) {
							newUsername =
								username + Math.floor(Math.random() * 10000);
							userWithUsername = await Users.findOne({
								username: newUsername,
							});
						}

						dbUser = await Users.create({
							username: newUsername,
							email: user.email,
							isVerified: true,
							isAcceptingMessages: true,
						});
					}
					// Now we have the user from the DB, either found or created
					token._id = dbUser._id as string;
					token.isVerified = dbUser.isVerified;
					token.isAcceptingMessages = dbUser.isAcceptingMessages;
					token.username = dbUser.username;
				} catch (error) {
					console.error(
						"Error in JWT callback for Google provider",
						error,
					);
				}
			} else if (user) {
				// This is for the credentials provider
				token._id = user._id as string;
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
				session.user._id = token._id as string;
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
	secret: process.env.NEXTAUTH_SECRET as string,
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	debug: process.env.NODE_ENV === "development" ? true : false,
};
