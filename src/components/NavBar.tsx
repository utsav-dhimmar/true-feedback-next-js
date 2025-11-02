"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Button } from "./ui/button";

export function VisitDashboardBtn() {
	const pathname = usePathname();
	return pathname !== "/dashboard" ? (
		<Button
			className="w-full md:w-auto"
			variant={"outline"}
			onClick={() => redirect("/dashboard")}
		>
			Dashboard
		</Button>
	) : null;
}

export default function NavBar() {
	const { data: session } = useSession();
	const user = session?.user;
	return (
		<header>
			<nav className="w-full p-4 md:p-6 shadow-md bg-secondary text-foreground">
				<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
					<Link href={"/"} className="text-xl font-bold mb-2 md:mb-0">
						True Feedback{" "}
					</Link>
					{session ? (
						<>
							<span className="m-1">
								Welcome {user?.username || user?.email || "user"}
							</span>
							<div className="flex gap-2 flex-col md:flex-row">
								<Button
									className="w-full md:w-auto"
									variant={"outline"}
									onClick={() =>
										signOut({
											redirect: true,
											callbackUrl: "/sign-in",
										})
									}
								>
									Sign out
								</Button>
								<VisitDashboardBtn />
							</div>
						</>
					) : (
						<Link href={"/sign-in"}>
							<Button className="w-full md:w-auto" variant={"outline"}>
								Login
							</Button>
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
