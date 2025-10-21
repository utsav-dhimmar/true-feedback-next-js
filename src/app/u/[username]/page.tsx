// 1. first directly use text area with state
// 2. why not using shadcn ?
// 3. how ai suggestion will send ?
// 4. after sending message clear text
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schema/message.schema";
import type { ApiResponse } from "@/types/ApiResponse";
import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@react-email/components";
import axios, { type AxiosError } from "axios";
import { BrainCircuit } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

type InputType = z.infer<typeof messageSchema>;

const SPECIAL_CHAR = "||";
const suggestedMessages = (message: string): string[] =>
	message.split(SPECIAL_CHAR);

export default function Page() {
	const { username } = useParams<{ username: string }>();
	const [loading, setLoading] = useState(false);

	const { error, complete, completion, isLoading } = useCompletion({
		api: "/api/message/suggest-message",
		initialCompletion:
			"What are you doing?||What is Love? || What do you do for living?",
	});

	const form = useForm<InputType>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleFormSubmission: SubmitHandler<InputType> = (data) => {
		handleSendMessage(data.content);
		form.resetField("content");
	};

	const handleSendMessage = async (message: string) => {
		setLoading(true);
		try {
			const res = await axios.post<ApiResponse>("/api/message/send-message", {
				content: message,
				username,
			});
			form.clearErrors("content");
			if (res.status === 201) {
				toast.success(res.data.message);
			} else {
				toast.warning(res.data.message);
			}
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message = axiosErrors.response?.data.message;
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const suggestMessages = async () => {
		try {
			complete("");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container mx-auto m-2 p-2">
			<div className="m-2 text-center">
				<h1 className="text-3xl font-bold md:text-4xl">Public Profile Link</h1>
			</div>
			<div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleFormSubmission)}>
						<FormField
							name="content"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Send anonymous message to{" "}
										<Badge variant="default" className="break-all">
											@{username}
										</Badge>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Write anonymous message here"
											{...field}
										/>
									</FormControl>

									{form.formState.errors.content && (
										<FormMessage>
											{form.formState.errors.content.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>
						<div className="flex items-center justify-center my-2">
							<Button disabled={loading || isLoading} type="submit">
								{loading && <Spinner />} Send message
							</Button>
						</div>
					</form>
				</Form>
			</div>
			<div className="text-center space-y-2 ">
				<div className="flex items-center justify-center my-2">
					<Button
						onClick={suggestMessages}
						disabled={loading || isLoading}
						variant={"outline"}
					>
						Suggest Messages <BrainCircuit />
					</Button>
				</div>
				<p>Click on any message below to select it.</p>
				<Card>
					<CardHeader>
						<CardTitle>Messages</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col space-y-4">
						{suggestedMessages(completion).map((message) => (
							<Button
								variant="outline"
								className="mb-2 h-auto whitespace-normal break-words"
								onClick={() => handleSendMessage(message)}
								key={message}
							>
								{message}
							</Button>
						))}
						{error && (
							<div>
								<p className="text-destructive">{error.message}</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Separator className="my-2" />
			<div className="text-center">
				Want to recive anoymous feadback ?{" "}
				<Link href="/sign-up">Click here to start</Link>
			</div>
		</div>
	);
}
