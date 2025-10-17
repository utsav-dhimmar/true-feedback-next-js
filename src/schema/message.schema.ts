import * as z from "zod";
import { usernameValidation } from "./signup.schema";

export const acceptingMessageSchema = z.object({
	acceptMessage: z.boolean(),
});

export const messageSchema = z.object({
	username: usernameValidation,
	content: z
		.string({
			error: "Content must be required",
		})
		.min(10, {
			error: "Content must have atleat 10 characters",
		})
		.max(400, {
			error: "Content should not be more than 400 characters",
		}),
});
