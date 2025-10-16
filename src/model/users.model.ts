import mongoose, { Document, Schema, model } from "mongoose";

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	isVerified: boolean;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isAcceptingMessage: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, "username is required"],
			unique: [true, "username is should be unique"],
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: [true, "email is should be unique"],
			trim: true,
			lowercase: true,
			match: [
				/(^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+[\.][a-z]+$)/gm,
				"Enter valid password",
			], // copy from regex101 LOL
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifyCode: {
			type: String,
			required: [true, "verify code is required"],
		},
		verifyCodeExpiry: {
			type: Date,
			required: [true, "verifyCodeExpiry is required"],
		},
		isAcceptingMessage: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

// next js work on vercal function
// for a first time code execute -> model<IUser>("Users", userSchema) will not create any problem but ....
// next request come immediately then same function may used for saving time , but in such case connection and model still in memory than it create issue
// so if model still in memory then just reuse it
// if no model in memory then it will create without any problem
const Users =
	(mongoose.models.Users as mongoose.Model<IUser>) ||
	model<IUser>("Users", userSchema);

export default Users;
