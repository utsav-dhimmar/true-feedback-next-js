"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function NavBar() {
	const { data: session } = useSession();
	const user = session?.user;
	return (
		<header>
			<nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
				<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
					<Link href={"/"} className="text-xl font-bold mb-2 md:mb-0">
						True Feedback{" "}
					</Link>
					{session ? (
						<>
							<span className="m-2">
								Welcome {user?.email || user?.username}
							</span>
							<Button
								className="w-full md:w-auto bg-slate-100 text-black"
								variant={"outline"}
								onClick={() =>
									signOut({
										redirect: true,
									})
								}
							>
								Sign out
							</Button>
						</>
					) : (
						<Link href={"/sign-in"}>
							<Button
								className="w-full md:w-auto bg-slate-100 text-black"
								variant={"outline"}
							>
								Login
							</Button>
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
