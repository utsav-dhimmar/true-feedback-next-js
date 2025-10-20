"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { acceptingMessageSchema } from "@/schema/message.schema";
import type { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface IMessageCard {
	_id: string;
	userId: string;
	content: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	__v: number;
}

export default function DashboardPage() {
	const [loading, setLoading] = useState(false);
	const [allMessage, setAllMessages] = useState<IMessageCard[]>([]);
	const { data: session } = useSession();
	const user = session?.user;

	const { register, watch, setValue } = useForm({
		resolver: zodResolver(acceptingMessageSchema),
	});

	const acceptMessages = watch("acceptMessage", false);
	console.log("acceptMessages value on first render ", acceptMessages);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get("/api/get-message");
			setAllMessages(res.data.data || []);
			// console.log(res);
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message = axiosErrors.response?.data.message;
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleMessageDelete = (messageId: string) => {
		setAllMessages(
			allMessage?.filter(message => message._id !== messageId),
		);
	};

	const baseUrl = `${window.location.origin}`;
	const profileUrl = `${baseUrl}/u/${user?.username}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success("URL Copied!", {
			description: "Profile URL has been copied to clipboard.",
		});
	};

	const getAcceptMessageStatus = useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get<ApiResponse>("/api/accept-message");

			setValue("acceptMessage", res.data.isAcceptingMessages!);
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message = axiosErrors.response?.data.message;
			toast.warning(message);
		} finally {
			setLoading(false);
		}
	}, [setValue]);

	useEffect(() => {
		if (!session || !session.user) return;
		fetchData();
		getAcceptMessageStatus();
	}, [session, getAcceptMessageStatus, fetchData]);

	const handleSwitchChanges = async () => {
		setLoading(true);
		try {
			const res = await axios.post<ApiResponse>("/api/accept-message", {
				acceptingMessage: !acceptMessages,
			});
			setValue("acceptMessage", !acceptMessages);
			toast(res.data.message);
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message = axiosErrors.response?.data.message;
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	if (!session || !session.user) {
		return <div> Login first</div>;
	}
	return (
		<main>
			<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
				<h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
				<div className="mb-4">
					<h2 className="text-lg font-bold mb-2">
						Copy your unique link
					</h2>
					<div className="flex items-center">
						<input
							type="text"
							value={profileUrl}
							disabled
							className="input input-bordered w-full p-2 mr-2"
						/>
						<Button onClick={copyToClipboard}>
							<Copy />
						</Button>
					</div>
				</div>
				<div className="mb-4">
					<Switch
						{...register("acceptMessage")}
						checked={acceptMessages}
						onCheckedChange={handleSwitchChanges}
						disabled={loading}
					/>
					<span className="ml-2">
						Accept Messages: {acceptMessages ? "On" : "Off"}
					</span>
				</div>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
					{allMessage && allMessage.length > 0 ? (
						allMessage.map(messageData => (
							<MessageCard
								message={messageData}
								key={messageData._id}
								onMessageDelete={handleMessageDelete}
							/>
						))
					) : (
						<p>No messages are found</p>
					)}
				</div>
			</div>
		</main>
	);
}
