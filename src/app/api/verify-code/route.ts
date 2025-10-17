/*
 * 1. get 6 digit verify code as input
 * 2. check in db ^* check verify code in DB and ensure that verify code is not expiry
 * 3. once both success then send then send success response and on ui send on login
 * 4. done
 */

import connectToDB from "@/db/dbConnect";
import Users from "@/model/users.model";
import { verificationSchema } from "@/schema/verify.schema";
import { parserInputWithZodSchema } from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		await connectToDB();
		const { username, verifyCode } = await request.json();
		const decodedUsername = decodeURIComponent(username);

		const { message, data, success } = parserInputWithZodSchema(
			{ code: verifyCode, username: decodedUsername },
			verificationSchema,
		);

		if (message && !data && !success) {
			return NextResponse.json(
				{
					message,
				},
				{ status: 400 },
			);
		}

		const user = await Users.findOne({
			username: data?.username,
		});

		if (!user) {
			return NextResponse.json(
				{
					message: "User not found",
					success: false,
				},
				{ status: 400 },
			);
		}

		const isValidCode = user.verifyCode === String(data?.code);
		const isCodeNotExpiry = user.verifyCodeExpiry! > new Date();

		if (isValidCode && isCodeNotExpiry) {
			user.isVerified = true;
			delete user.verifyCode;
			delete user.verifyCodeExpiry;

			await user.save();
			return NextResponse.json(
				{
					message: "user verify successfully",
					success: true,
				},
				{ status: 200 },
			);
		} else if (!isCodeNotExpiry) {
			return NextResponse.json(
				{
					message: "verification code has been expiry, please sign up again",
					success: false,
				},
				{ status: 400 },
			);
		} else {
			return NextResponse.json(
				{
					message: "incorrect verification code",
					success: false,
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Something went wrong while verify code", error);
		return NextResponse.json(
			{
				message: "Something went wrong while verify code",
				success: false,
			},
			{ status: 500 },
		);
	}
}
