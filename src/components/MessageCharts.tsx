"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
	{ month: "July", desktop: 294 },
	{ month: "August", desktop: 167 },
	{ month: "September", desktop: 211 },
	{ month: "October", desktop: 321 },
	{ month: "November", desktop: 98 },
	{ month: "December", desktop: 254 },
];

const chartConfig = {
	messageCount: {
		label: "Count",
		color: "color-chart-1",
	},
} satisfies ChartConfig;

export function MessageCharts({
	chartData,
}: {
	chartData: { month: string; messageCount: number }[];
}) {
	return (
		<ChartContainer config={chartConfig} className="min-h-[100px] w-full">
			<BarChart accessibilityLayer data={chartData}>
				<CartesianGrid vertical={true} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar dataKey="messageCount" fill="var(--color-chart-1)" radius={4} />
			</BarChart>
		</ChartContainer>
	);
}
