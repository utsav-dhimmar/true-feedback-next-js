import connectToDB from "@/db/dbConnect";
import Users from "@/model/users.model";
import { userSignupSchema } from "@/schema/signup.schema";
import { hashPassword } from "@/utils/bcrypt";
import { sendVerificationEmail } from "@/utils/email/verificationEmail";
import { parserInputWithZodSchema } from "@/utils/validations";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		await connectToDB();

		const { username, email, password } = await request.json();
		const { success, message, data } = parserInputWithZodSchema(
			{ username, email, password },
			userSignupSchema,
		);

		if (message && !success && !data) {
			return NextResponse.json(
				{
					message: message,
					sucess: false,
				},
				{
					status: 400,
				},
			);
		}

		// can be combined in one find
		const existingVerifiedUserByUsername = await Users.findOne({
			username: data?.username,
			isVerified: true,
		});

		if (existingVerifiedUserByUsername) {
			return NextResponse.json(
				{
					message: "username is already taken",
					success: false,
				},
				{ status: 400 },
			);
		}

		const existingUserByEmail = await Users.findOne({
			email: data?.email,
		});

		const hashedPassword = await hashPassword(String(data?.password));
		// otp
		const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString(); // random number between 100000 to 999999
		const expiry = new Date(Date.now() + 3600000);

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return NextResponse.json(
					{
						message: "User already exists with this email",
						success: false,
					},
					{ status: 400 },
				);
			} else {
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = expiry;

				await existingUserByEmail.save();
			}
		} else {
			const newUser = await Users.create({
				username: data?.username,
				email: data?.email,
				password: hashedPassword,
				isVerified: false, // optional
				verifyCode: verifyCode,
				verifyCodeExpiry: expiry,
				isAcceptingMessage: true,
			});
		}

		// sent email
		const emailSendResponse = await sendVerificationEmail({
			username: String(data?.username) || "",
			email: String(data?.email) || "",
			otp: verifyCode,
		});
		// unable to send email
		if (!emailSendResponse.success) {
			return NextResponse.json(
				{
					message: emailSendResponse.message,
					success: false,
				},
				{ status: 500 },
			);
		}

		// email sent successfully
		return NextResponse.json(
			{
				message:
					"You have registered successfully! Please verify your account by entering the OTP sent to your email address.",
				success: true,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(`[Error] while registering user `, error);
		return NextResponse.json(
			{
				message: "Error while registering user",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
