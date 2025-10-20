import type { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../../emails/verification-email";
import { resend } from "../resend";

export async function sendVerificationEmail({
	email,
	username,
	otp,
}: {
	email: string;
	username: string;
	otp: string;
}): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: "True Feedback <onboarding@resend.dev>",
			to: email,
			subject: "Verification code for true feedback",
			react: VerificationEmail({ username, otp }),
		});
		return {
			message: "Email sent successfully",
			success: true,
		};
	} catch (error) {
		console.error(`[Error] verification email could'nt sent`, error);
		return {
			message: "Unable to send verification email",
			success: false,
		};
	}
}
