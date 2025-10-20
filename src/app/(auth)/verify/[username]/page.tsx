"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import {
	usernameAndVerificationCodeSchema,
	verificationSchema,
} from "@/schema/verify.schema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type Input = z.infer<typeof verificationSchema>;

export default function VerifyPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get("code")?.slice(0, 6);
	// console.log(code);
	const { username } = useParams<{ username: string }>();
	const [message, setMessage] = useState("");
	const [isIssue, setIsIssue] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<Input>({
		resolver: zodResolver(verificationSchema),
		defaultValues: {
			code: code || "",
		},
	});

	const checkIssue = (username: string, code: string) => {
		if (username && code) {
			const result = usernameAndVerificationCodeSchema.safeParse({
				username,
				code,
			});

			if (result.success === false) {
				const errorMessage = result.error?.issues
					.map(({ message }) => message)
					.join(", ");
				setIsIssue(true);
				setMessage(errorMessage);
				toast.error(errorMessage);
			}
		}
	};

	useEffect(() => {
		checkIssue(username, "");
	}, [username]);

	async function onSubmit(data: Input) {
		try {
			console.log(data);
			setLoading(true);

			const verifyCodeResponse = await axios.post<ApiResponse>(
				`/api/verify-code/`,
				{
					verifyCode: data.code,
					username,
				},
			);

			if (verifyCodeResponse.status === 200) {
				toast.success(verifyCodeResponse.data.message);
				router.push("/sign-in");
			} else {
				toast.warning(verifyCodeResponse.data.message);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;

			const message = axiosError.response?.data.message;
			toast.warning(message ?? "An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-500 ">
			<div className="w-full max-w-sm md:max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify Your Account
					</h1>
					<p className="mb-4">Enter the verification code sent to your email</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="">One-Time Password</FormLabel>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} className="w-15 h-15" />
												<InputOTPSlot index={1} className="w-15 h-15" />
												<InputOTPSlot index={2} className="w-15 h-15" />
												<InputOTPSlot index={3} className="w-15 h-15" />
												<InputOTPSlot index={4} className="w-15 h-15" />
												<InputOTPSlot index={5} className="w-15 h-15" />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription className="text-white">
										Please enter the one-time password sent to your email.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={loading || isIssue}
							className="w-full"
						>
							{loading && <Spinner />} Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
