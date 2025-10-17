import * as z from "zod";
import { usernameValidation } from "./signup.schema";

export const verificationSchema = z.object({
	username: usernameValidation,
	code: z
		.string({
			error: "Verification code must be string",
		})
		.length(6, {
			error: "Verification code must be 6 digit",
		}),
});
