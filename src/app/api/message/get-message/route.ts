import { nextAuthOption } from "@/auth";
import connectToDB from "@/db/dbConnect";
import Messages from "@/model/messages.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export interface MessageType {
	id: string;
	userId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

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

		const response: MessageType[] = await Messages.aggregate([
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
		console.log(response);
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
		const helper = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const chartDataHelper = [
			{ month: "January", messageCount: 0 },
			{ month: "February", messageCount: 0 },
			{ month: "March", messageCount: 0 },
			{ month: "April", messageCount: 0 },
			{ month: "May", messageCount: 0 },
			{ month: "June", messageCount: 0 },
			{ month: "July", messageCount: 0 },
			{ month: "August", messageCount: 0 },
			{ month: "September", messageCount: 0 },
			{ month: "October", messageCount: 0 },
			{ month: "November", messageCount: 0 },
			{ month: "December", messageCount: 0 },
		];

		const charData = response.reduce((acc, curr) => {
			const postDate = new Date(curr.createdAt);
			const postMonth = helper[postDate.getMonth()];
			const postObj = acc.find(({ month }) => month === postMonth);
			if (postObj) postObj.messageCount += 1;
			return acc;
		}, chartDataHelper);

		return NextResponse.json(
			{ success: true, messages: response, charData },
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
