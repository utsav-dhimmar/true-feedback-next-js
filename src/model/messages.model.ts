import mongoose, { type Document, ObjectId, Schema, model } from "mongoose";

export interface IMessage extends Document {
	_id: string | ObjectId;
	userId: string | ObjectId; // id of user which message bellongs to the user
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: [true, "Auther id is required"],
		},
		content: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Messages =
	(mongoose.models.Message as mongoose.Model<IMessage>) ||
	model<IMessage>("Message", messageSchema);

export default Messages;
