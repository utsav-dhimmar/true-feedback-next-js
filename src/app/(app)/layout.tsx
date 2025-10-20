import NavBar from "@/components/NavBar";
import type React from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="flex flex-col min-h-screen">
			<NavBar />
			{children}
		</main>
	);
}
