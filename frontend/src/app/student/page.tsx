"use client"

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HomeworksCard } from "@/components/cards/HomeworksCard";
import { EventsCard } from "@/components/cards/AbsencesCard";
import { EventType } from "@/types/eventType";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import { DashboardAverageCard } from "@/components/cards/DashboardAverageCard";
import { GradesListCard } from "@/components/cards/GradesListCard";
import UserStore from "@/stores/user";
import {useEffect} from "react";

export default function HomePage() {
	const userStore = UserStore.useContainer();
	return <div className="bg-background text-foreground flex items-center p-3 gap-6 text-center bg-gradient-to-b from-background to-muted">
		<AppSidebar activeChild={userStore.selectedStudent} onSelectChildAction={userStore.selectStudent} />
		<main className="flex flex-col w-full items-center justify-center gap-6">
			<div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
				<SidebarTrigger />
				<div>
					<h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
						Welcome, <span className="text-primary">{userStore.getName(true).toString()}!</span>
					</h1>
					<h2 className="scroll-m-20 text-xl align-center tracking-tight">Monitor your child&#39;s school progress and attendance</h2>
				</div>
				<br />
			</div>
			{userStore.isParent &&
				<KidInfoAlert name={userStore.selectedStudent?.name!} />
			}
			<div className="grid grid-rows-2 grid-cols-3 gap-12">
				<DashboardAverageCard grades={[{ grade: 8, day: "08/02" }, { grade: 7, day: "09/02" }, { grade: 9, day: "10/02" }]} />
				<HomeworksCard homeworks={[{
					title: "Do the homeworks",
					description: "Homework where you have to do your homeworks",
					homeworkId: 123,
					subjectId: 123,
					dueDate: "27/07/2027",
					classId: 132,
					createdAt: "26/07/2027",
					teacherId: 111
				}]} />

				<EventsCard events={[{
					id: 123,
					type: EventType.ABSENCE,
					date: "17/04/2025"
				}]} />

				<GradesListCard grades={[{ name: "Matematica", date: "09/02/2025", grade: 6, id: 321 }, { name: "Storia", date: "11/05/2025", grade: 5, id: 321 }]} />
			</div>
		</main>
	</div>
}