import { nextAuthOption } from "@/auth";
import connectToDB from "@/db/dbConnect";
import Messages from "@/model/messages.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

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
		const userId = new mongoose.Types.ObjectId(user._id!);

		// todo add more data if require

		const response = await Messages.aggregate([
			{
				// find data for current user , not from all
				$match: {
					userId: userId,
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
		]);
		// console.log("get-message response", response);
		if (!response) {
			return NextResponse.json(
				{
					message: "no messages found",
					success: false,
				},
				{
					status: 404,
				},
			);
		}
		return NextResponse.json(
			{ success: true, messages: response },
			{ status: 200 },
		);
	} catch (error) {
		console.error(`[Error] while get-message `, error);
		return NextResponse.json(
			{
				message: "Error getting messages",
				success: false,
			},
			{
				status: 500,
			},
		);
	}
}
