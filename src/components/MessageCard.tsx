"use client";

import type { IMessageCard } from "@/app/(app)/dashboard/page";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "./ui/card";

interface MessageCard {
	message: IMessageCard;
	onMessageDelete: (messageId: string) => void;
}
export default function MessageCard({ message, onMessageDelete }: MessageCard) {
	const handleMessageDelete = async () => {
		try {
			const res = await axios.delete<ApiResponse>(
				`/api/delete-message/${message._id}`,
			);
			onMessageDelete(message._id);
			if (res.status === 200) {
				toast.success(res.data.message);
			} else {
				toast.warning(res.data.message);
			}
		} catch (error) {
			const axiosErrors = error as AxiosError<ApiResponse>;
			const message = axiosErrors.response?.data.message;
			toast.error(message);
		} finally {
		}
	};
	return (
		<div>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>{message.content}</CardTitle>

						<AlertDialog>
							<AlertDialogTrigger>
								{/*<Button>*/}
								<Trash2 className="text-red-400"></Trash2>
								{/*</Button>*/}
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Do you really want to delete the
										message?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently delete this messages from
										our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleMessageDelete}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
					<div className="text-sm">
						{new Date(message.createdAt).toLocaleString("")}
					</div>
				</CardHeader>
			</Card>
		</div>
	);
}
