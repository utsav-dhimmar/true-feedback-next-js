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
import { userSignInSchema } from "@/schema/signup.schema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

type Inputs = z.infer<typeof userSignInSchema>;

export default function SignInPage() {
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const form = useForm<Inputs>({
		resolver: zodResolver(userSignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data, e) => {
		// toast.warning("backend communication is pending");
		// return;
		try {
			setLoading(true);
			const res = await signIn("Credentials", {
				redirect: false,
				email: data.email,
				password: data.password,
			});
			console.log(res);
			if (res?.error) {
				toast.error("Login failed", {
					description: res.error ?? "Incorrect credentials",
				});
			} else {
				toast.success("Login success");
				router.push("/dashboard");
			}
			// const signInResponse = await axios.post<ApiResponse>(
			// 	"/api/auth/sign-in",
			// 	data,
			// );
			// if (signInResponse.status === 201) {
			// 	toast.success(signInResponse.data.message);
			// 	router.push("/");
			// } else {
			// 	toast.warning(signInResponse.data.message);
			// }
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
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-sm md:max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
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
						<Button onClick={() => signIn("google")} className="w-full">
							Coutine With Google
						</Button>
						<div className="text-center mt-4">
							<p>
								Not a member?{" "}
								<Link
									href="/sign-up"
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
