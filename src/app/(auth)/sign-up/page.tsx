"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { userSignupSchema } from "@/schema/signup.schema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import type * as z from "zod";

type Inputs = z.infer<typeof userSignupSchema>;

export default function SignupPage() {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isUsernameChecking, setIsUsernameChecking] = useState(false);
	const [loading, setLoading] = useState(false);
	const [debouceUsername, setDebouceUsername] = useDebounceValue(username, 500);
	const router = useRouter();

	const form = useForm<Inputs>({
		resolver: zodResolver(userSignupSchema),
		defaultValues: {
			username: debouceUsername,
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUserName = async () => {
			if (debouceUsername) {
				setIsUsernameChecking(true);
				try {
					const uniqueUsernameResponse = await axios.get<ApiResponse>(
						`/api/unique-username-check?username=${debouceUsername}`,
					);
					setUsernameMessage(uniqueUsernameResponse.data.message);
				} catch (error) {
					console.log(error);
					const axiosErrors = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosErrors?.response?.data?.message ?? "error in username check",
					);
				} finally {
					setIsUsernameChecking(false);
				}
			}
		};
		checkUserName();
	}, [debouceUsername]);

	const onSubmit: SubmitHandler<Inputs> = async (data, e) => {
		try {
			setLoading(true);
			const signInResponse = await axios.post<ApiResponse>(
				"/api/sign-up",
				data,
			);
			if (signInResponse.status === 201) {
				toast.success(signInResponse.data.message);
				router.push("/sign-in");
			} else {
				toast.warning(signInResponse.data.message);
			}
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message =
				axiosErrors?.response?.data?.message ?? "error in username check";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-primary">
			<div className="m-2 w-full max-w-sm md:max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
						{/* username */}
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="text"
											onChange={(e) => {
												field.onChange(e);
												setUsername(e.target.value);
											}}
										/>
									</FormControl>
									{isUsernameChecking && <Loader />}
									{usernameMessage && (
										<FormMessage className="text-primary">
											{usernameMessage}
										</FormMessage>
									)}
									{form.formState.errors.username && (
										<FormMessage>
											{form.formState.errors.username.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>

						{/* email */}
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} type="email" />
									</FormControl>
									{form.formState.errors.email && (
										<FormMessage>
											{form.formState.errors.email.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>

						{/* password */}
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											autoComplete="current-password"
										/>
									</FormControl>
									{form.formState.errors.password && (
										<FormMessage>
											{form.formState.errors.password.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<Button disabled={loading} type="submit" className="w-full">
							{loading && <Spinner />} Submit
						</Button>
						<Button
							type="button"
							disabled={loading}
							onClick={() => signIn("google")}
							className="w-full"
						>
							Coutine With Google
						</Button>
						<div className="text-center mt-4">
							<p>
								Already a member?{" "}
								<Link
									href="/sign-in"
									className="text-blue-600 hover:text-blue-800 hover:underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
