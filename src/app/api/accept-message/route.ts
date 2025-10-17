// get status of accepting message
// first user must be login
//
// update the status of accepting message

import { nextAuthOption } from "@/auth";
import connectToDB from "@/db/dbConnect";
import Users from "@/model/users.model";
import { acceptingMessageSchema } from "@/schema/message.schema";
import { parserInputWithZodSchema } from "@/utils/validations";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		await connectToDB();

		const session = await getServerSession(nextAuthOption);
		if (!session || !session?.user) {
			return NextResponse.json(
				{
					success: false,
					message: "Not authenticated",
				},
				{ status: 401 },
			);
		}
		const user = session.user;
		const userInfo = await Users.findById(user._id).select(
			"+isAcceptingMessages",
		);

		if (!userInfo) {
			return Response.json(
				{ success: false, message: "User not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				isAcceptingMessages: userInfo.isAcceptingMessages,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(`[Error] while registering user `, error);
		return NextResponse.json(
			{
				message: "Error getting status of accepting messages",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectToDB();

		const session = await getServerSession(nextAuthOption);

		if (!session || !session?.user) {
			return NextResponse.json(
				{
					success: false,
					message: "Not authenticated",
				},
				{ status: 401 },
			);
		}
		const { acceptingMessage } = await request.json();
		const user = session.user;

		const { message, data, success } = parserInputWithZodSchema(
			{ acceptMessage: acceptingMessage },
			acceptingMessageSchema,
		);

		if (message && !success && !data) {
			return NextResponse.json(
				{
					message: message,
				},
				{
					status: 400,
				},
			);
		}
		const updatedUser = await Users.findByIdAndUpdate(
			user._id,
			{
				isAcceptingMessages: data?.acceptMessage,
			},
			{
				new: true,
			},
		);

		if (!updatedUser) {
			return Response.json(
				{ success: false, message: "User not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "accept message status updated successfully",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(`[Error] while registering user `, error);
		return NextResponse.json(
			{
				message: "Error getting status of accepting messages",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
