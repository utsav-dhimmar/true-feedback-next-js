import type { ZodObject, ZodRawShape } from "zod";

export function parserInputWithZodSchema<T extends ZodRawShape>(
	data: unknown,
	schema: ZodObject<T>,
) {
	const zodResult = schema.safeParse(data);
	if (zodResult.success) {
		return {
			success: true,
			data: zodResult.data as T,
			// message: "Validation success",
		};
	} else {
		return {
			success: false,
			message: zodResult.error?.issues
				.map(({ message }) => message)
				.join(", "),
			// data: {},
		};
	}
}
