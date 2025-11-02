import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware";

export async function proxy(request: NextRequest) {
	const token = await getToken({
		req: request,
	});

	const currentPath = request.nextUrl.pathname;

	const publicPaths = ["/sign-in", "/sign-up", "/verify"];
	const privatePaths = ["/dashboard"];

	if (token && publicPaths.includes(currentPath)) {
		return NextResponse.redirect(
			new URL("/dashboard", request.nextUrl.origin),
		);
	}

	if (!token && privatePaths.includes(currentPath)) {
		return NextResponse.redirect(
			new URL("/sign-in", request.nextUrl.origin),
		);
	}

	return NextResponse.next();
}

// routes where middleware we went to run
export const config = {
	matcher: ["/sign-in", "/sign-up", "/verify", "/dashboard"],
};
