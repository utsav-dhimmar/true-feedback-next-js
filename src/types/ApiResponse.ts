export interface IMessage {
	_id: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessages?: boolean;
	messages?: Array<IMessage>;
}
