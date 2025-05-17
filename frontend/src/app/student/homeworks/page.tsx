"use client"

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import UserStore from "@/stores/user";
import { Calendar } from "@/components/ui/calendar";
import HomeworkCard from "@/components/cards/HomeworkCard";
import { Homework } from "@/types/homework";
import { useState } from "react";
import {Card} from "@/components/ui/card";

export default function Homeworks() {
	const userStore = UserStore.useContainer();
	//const { grades, isLoadingGrades, isErrorGrades } = useGrades()
	const [selectedDay, setDay] = useState<Date>(new Date())

	const testHomeworks: Homework[] = [
		{
			teacherName: "Jane Doe",
			subjectName: "Maths",
			title: "Do the homeworks",
			description: "Homework where you have to do your homeworks",
			homeworkId: 123,
			subjectId: 123,
			dueDate: "27/07/2027",
			classId: 132,
			createdAt: "26/07/2027",
			teacherId: 111
		}
	]
	return <div className="bg-background text-foreground flex items-center p-3 gap-6 text-center bg-gradient-to-b from-background to-muted h-full">
		<AppSidebar />

		<main className="flex flex-col w-full items-center justify-center gap-6">
			<div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
				<SidebarTrigger />
				<div>
					<h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">Homeworks</h1>
					<h2 className="scroll-m-20 text-xl align-center tracking-tight">These are your homeworks, make sure to do them all!</h2>
				</div>
				<br />
			</div>
			{userStore.isParent &&
				<KidInfoAlert name={userStore.selectedStudent?.name!} />
			}
			<Card className="border-t border-t-[2px]">
				<Calendar
					mode="single"
					selected={undefined}
					disabled={(date) =>
						date < new Date("1900-01-01")
					}
					initialFocus
					onMonthChange={(month) => setDay(month)}
				/>
			</Card>

			{selectedDay.getMonth()}
			<div className="grid grid-rows-2 grid-cols-3 gap-12">
				{testHomeworks.map((homework: Homework) => <HomeworkCard homework={homework} key={homework.homeworkId} />)}
			</div>
		</main>
	</div>
}