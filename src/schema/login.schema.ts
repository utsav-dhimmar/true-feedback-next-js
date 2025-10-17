import * as z from "zod";
import { emailValidation, passwordValidation } from "./signup.schema";

export const loginSchema = z.object({
	email: emailValidation, // idenitifire
	password: passwordValidation,
});
