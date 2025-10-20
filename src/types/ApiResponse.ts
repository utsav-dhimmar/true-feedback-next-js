import type { IMessage } from "@/model/messages.model";

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessages?: boolean;
	messages?: Array<IMessage>;
}
