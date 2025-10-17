import { nextAuthOption } from "@/auth";
import connectToDB from "@/db/dbConnect";
import Users from "@/model/users.model";
import mongoose from "mongoose";
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
		const userId = new mongoose.Schema.Types.ObjectId(user._id!);

		// todo add more data if require

		const response = await Users.aggregate([
			{
				// find data for current user , not from all
				$match: {
					_id: userId,
				},
			},
			{
				// get all messages of the user
				$lookup: {
					from: "messages",
					localField: "_id",
					foreignField: "userId",
					as: "messages",
				},
			},
			{
				$sort: {
					"messages.createdAt": -1,
				},
			},
		]);
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
			{ success: true, data: response },
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
