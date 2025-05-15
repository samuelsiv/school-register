"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { GradesChart } from "@/components/charts/GradesChart";
import { HomeworksCard } from "@/components/cards/HomeworksCard";
import { EventsCard } from "@/components/cards/AbsencesCard";
import { EventType } from "@/types/EventType";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BabyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrades, useUserInfo } from "@/lib/data";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import { AveragesOverviewCard } from "@/components/cards/AveragesOverviewCard";
import { GradesListCard } from "@/components/cards/GradesListCard";
import { useEffect, useState } from "react";
import { Student } from "@/types/Student";
import { getJsonStore, getStore } from "@/lib/storage";
import UserStore from "@/stores/user";
import {DayPicker} from "react-day-picker";
import {Calendar} from "@/components/ui/calendar";
import HomeworkCard from "@/components/cards/HomeworkCard";
import {Homework} from "@/types/Homework";

export default function Homeworks() {
	const userStore = UserStore.useContainer();
	//const { grades, isLoadingGrades, isErrorGrades } = useGrades()
	const [selectedDay, setDay] = useState<Date>(new Date())

	const testHomeworks: Homework[] = [
		{
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
	return <div className="bg-background text-foreground flex items-center p-2 gap-6 text-center">
		<AppSidebar activeChild={userStore.selectedStudent} onSelectChildAction={userStore.selectStudent} />

		<main className="flex flex-col w-full items-center justify-center gap-6">
			<div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
				<SidebarTrigger />
				<div>
					<h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">Homeworks</h1>
					<h2 className="scroll-m-20 text-xl align-center tracking-tight">These are your homeworks, make sure to do them all!</h2>
				</div>
				<br />
			</div>
			<KidInfoAlert name={userStore.getName()} />
			<Calendar
				mode="single"
				selected={undefined}
				disabled={(date) =>
					date < new Date("1900-01-01")
				}
				initialFocus
				onMonthChange={(month) => setDay(month)}
			/>
			{selectedDay.getMonth()}
			<div className="grid grid-rows-1 grid-cols-3 gap-12">
				{testHomeworks.map((homework: Homework) => <HomeworkCard homework={homework} key={homework.homeworkId}/> )}
			</div>
		</main>
	</div>
}