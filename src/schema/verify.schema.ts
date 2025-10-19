import * as z from "zod";
import { usernameValidation } from "./signup.schema";

export const verificationSchema = z.object({
	code: z
		.string({
			error: "Verification code must be string",
		})
		.length(6, {
			error: "Verification code must be 6 digit",
		}),
});

export const usernameAndVerificationCodeSchema = z.object({
	username: usernameValidation,
	code: z.coerce
		.string({
			error: "Verification code must be string",
		})
		.length(6, {
			error: "Verification code must be 6 digit",
		})
		.optional(),
});
