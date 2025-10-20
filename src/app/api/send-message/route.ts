import connectToDB from "@/db/dbConnect";
import Messages from "@/model/messages.model";
import Users from "@/model/users.model";
import { messageBackendSchema } from "@/schema/message.schema";
import { parserInputWithZodSchema } from "@/utils/validations";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		await connectToDB();

		const { content, username } = await request.json();

		const { message, success, data } = parserInputWithZodSchema(
			{ content, username },
			messageBackendSchema,
		);

		if (message && !success && !data) {
			return NextResponse.json(
				{
					message: message,
					success: false,
				},
				{
					status: 400,
				},
			);
		}

		const user = await Users.findOne({ username: data?.username }).exec();
		if (!user) {
			return NextResponse.json(
				{
					messag: "no user found with this username",
					success: false,
				},
				{ status: 201 },
			);
		}
		if (!user.isAcceptingMessages) {
			return NextResponse.json(
				{
					message: "user is not accepting messages",
					success: false,
				},
				{ status: 403 },
			);
		}
		const newMessage = await Messages.create({
			userId: user._id,
			content: data?.content!,
		});

		return NextResponse.json(
			{
				message: "message successfully sent",
				success: true,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(`[Error] while send-message `, error);
		return NextResponse.json(
			{
				message: "Error while sending message",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
