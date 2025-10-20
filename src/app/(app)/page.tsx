"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";

const MESSAGES = [
	{
		title: "Message from User123",
		content: "Hey, how are you doing today?",
		received: "10 minutes ago",
	},
	{
		title: "Message from SecretAdmirer",
		content: "I really liked your recent post!",
		received: "2 hours ago",
	},
	{
		title: "Message from MysteryGuest",
		content: "Do you have any book recommendations?",
		received: "1 day ago",
	},
];

export default function Home() {
	return (
		<>
			<div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
				<section className="text-center mb-8 md:mb-12">
					<h1 className="text-3xl md:text-5xl font-bold">
						Dive into the World of Anonymous Feedback
					</h1>
					<p className="mt-3 md:mt-4 text-base md:text-lg">
						True Feedback - Where your identity remains a secret.
					</p>
				</section>
				<Carousel
					className="w-full max-w-lg md:max-w-xl"
					plugins={[
						Autoplay({
							delay: 2000,
						}),
					]}
				>
					<CarouselContent>
						{MESSAGES.map(({ title }) => (
							<CarouselItem key={title}>
								<Card>
									<CardHeader>
										<CardTitle>{title}</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
										<Mail className="flex-shrink-0" />
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			<footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
				© 2023 True Feedback. All rights reserved.
			</footer>
		</>
	);
}
