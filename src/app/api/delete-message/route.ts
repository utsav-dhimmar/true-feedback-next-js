import connectToDB from "@/db/dbConnect";
import Messages from "@/model/messages.model";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { messageId: string } },
) {
	try {
		await connectToDB();
		const { messageId } = params;
		const session = await getServerSession();
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
		// const userId = new mongoose.Schema.Types.ObjectId(user._id!);
		if (isValidObjectId(messageId)) {
			return NextResponse.json(
				{
					message: "Invalid object id, please try again",
					success: false,
				},
				{ status: 400 },
			);
		}
		const message = await Messages.findById(messageId);
		if (message?.userId !== user._id) {
			return NextResponse.json(
				{
					message: "This messages is not belongs to you :)",
					success: false,
				},
				{ status: 401 },
			);
		}
		const messageDeleteResponse =
			await Messages.findByIdAndDelete(messageId);

		if (!messageDeleteResponse) {
			return NextResponse.json(
				{
					message: "Unable to delete message",
					success: false,
				},
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{
				message: "message deleted successfully",
				success: true,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("unable to delete message", error);
		return NextResponse.json(
			{
				message: "unable to delete message",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
