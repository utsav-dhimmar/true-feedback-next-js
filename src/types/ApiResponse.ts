import { IMessage } from "@/model/messages.model";

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessage?: boolean;
	messages?: Array<IMessage>;
}
