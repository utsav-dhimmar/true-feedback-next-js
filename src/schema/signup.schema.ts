import * as z from "zod";

export const usernameValidation = z
	.string({
		error: "Enter valid username",
	})
	.nonempty()
	.min(2, "username should be atleast have")
	.max(20, "username must be less than 20 characters");

export const emailValidation = z.email({
	message: "Enter valid email",
});

export const passwordValidation = z
	.string({
		error: "",
	})
	.min(6, {
		error: "Password should be atleast have 6 characters",
	});

export const userSignupSchema = z.object({
	username: usernameValidation,
	email: emailValidation,
	passsword: passwordValidation,
});
