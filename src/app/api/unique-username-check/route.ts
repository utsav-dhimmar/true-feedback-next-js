import connectToDB from "@/db/dbConnect";
import Users from "@/model/users.model";
import { uniqueUsernameSchema } from "@/schema/signup.schema";
import { parserInputWithZodSchema } from "@/utils/validations";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		await connectToDB();

		const queryParam = request.nextUrl.searchParams.get("username");

		const { success, message, data } = parserInputWithZodSchema(
			{ username: queryParam },
			uniqueUsernameSchema,
		);

		if (!success && !data && message) {
			return NextResponse.json(
				{
					message,
				},
				{ status: 400 },
			);
		}
		// find user by username and it must be verified
		//
		const user = await Users.findOne({
			username: data?.username,
			isVerified: true,
		});

		if (user) {
			return NextResponse.json(
				{
					message: "username already taken",
					success: false,
				},
				{
					status: 200,
				},
			);
		}
		return NextResponse.json(
			{
				message: "username is unique 👍",
				success: true,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return NextResponse.json(
				{
					message: "Something went wrong while unique username check",
					success: false,
				},
				{ status: 500 },
			);
		}
	}
}
