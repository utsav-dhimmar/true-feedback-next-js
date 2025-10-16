import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

export interface IMessage extends Document {
  autherId: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    autherId: {
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
