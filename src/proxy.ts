import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const token = await getToken({ req: request });
	const { pathname } = request.nextUrl;

	const publicPaths = ["/sign-in", "/sign-up", "/verify"];
	const privatePaths = ["/dashboard"];

	if (token && publicPaths.includes(pathname)) {
		return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
	}

	if (!token && privatePaths.includes(pathname)) {
		return NextResponse.redirect(new URL("/sign-in", request.nextUrl.origin));
	}

	return NextResponse.next();
}

// routes where middleware we went to run
export const config = {
	matcher: ["/sign-in", "/sign-up", "/verify", "/dashboard"],
};
