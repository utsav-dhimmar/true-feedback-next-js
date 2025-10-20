import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
	});

	const currentPath = request.nextUrl.pathname;

	const publicPaths = ["/sign-in", "/sign-up", "/verify"];
	const privatePaths = ["/dashboard"];

	if (token && publicPaths.includes(currentPath)) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (!token && privatePaths.includes(currentPath)) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

// routes where middleware we went to run
export const config = {
	matcher: ["/sign-in", "/sign-up", "/", "/verify", "/dashboard"],
};
