import { nextAuthOption } from "@/auth";
import connectToDB from "@/db/dbConnect";
import Messages from "@/model/messages.model";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ messageId: string }> },
) {
	try {
		await connectToDB();
		const { messageId } = await params;
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
		// const userId = new mongoose.Schema.Types.ObjectId(user._id!);
		if (!isValidObjectId(messageId)) {
			return NextResponse.json(
				{
					message: "Invalid object id, please try again",
					success: false,
				},
				{ status: 400 },
			);
		}
		const message = await Messages.findById(messageId);
		// console.log(
		// 	"from the delete ",
		// 	"message.userId",
		// 	message?.userId.toString(),
		// 	"session: ",
		// 	session,
		// );
		if (message?.userId.toString() !== user?._id?.toString()) {
			return NextResponse.json(
				{
					message: "This messages is not belongs to you :)",
					success: false,
				},
				{ status: 401 },
			);
		}
		const messageDeleteResponse = await Messages.findByIdAndDelete(messageId);

		if (!messageDeleteResponse) {
			throw new Error("unable to delete message");
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
