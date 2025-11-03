import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/contexts/AuthProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "True feedback",
	description: "Send or receive feedback anonymously",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					{children}
					<Toaster richColors />
				</body>
			</AuthProvider>
		</html>
	);
}
