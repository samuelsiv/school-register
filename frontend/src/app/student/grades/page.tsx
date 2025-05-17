"use client"

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import { AveragesOverviewCard } from "@/components/cards/AveragesOverviewCard";
import { GradesListCard } from "@/components/cards/GradesListCard";
import UserStore from "@/stores/user";

export default function Grades() {
	const userStore = UserStore.useContainer();
	//const { grades, isLoadingGrades, isErrorGrades } = useGrades()

	return <div className="bg-background text-foreground flex items-center p-3 gap-6 text-center bg-gradient-to-b from-background to-muted h-full">
		<AppSidebar />

		<main className="flex flex-col w-full items-center justify-center gap-6">
			<div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
				<SidebarTrigger />
				<div>
					<h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">Grades</h1>
					<h2 className="scroll-m-20 text-xl align-center tracking-tight">Here are your child&#39;s latest exam results!</h2>
				</div>
				<br />
			</div>
			{userStore.isParent &&
				<KidInfoAlert name={userStore.selectedStudent?.name!} />
			}
			<div className="grid grid-rows-2 grid-cols-1 gap-12">
				<AveragesOverviewCard
					generalAverageByDays={[{ grade: 8, day: "08/02" }, { grade: 7, day: "09/02" }, { grade: 9, day: "10/02" }]}
					averagesBySubject={[
						{ name: "Maths", teacher: "John Doe", grade: 6, id: 321, grades: [{ name: "Math", date: "09/02/2025", grade: 6, id: 321 }] },
						{ name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{ name: "History", date: "11/05/2025", grade: 5, id: 321 }] },
						{ name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{ name: "History", date: "11/05/2025", grade: 5, id: 321 }] },

						{ name: "Maths", teacher: "John Doe", grade: 6, id: 321, grades: [{ name: "Math", date: "09/02/2025", grade: 6, id: 321 }] },
						{ name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{ name: "History", date: "11/05/2025", grade: 5, id: 321 }] },
						{ name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{ name: "History", date: "11/05/2025", grade: 5, id: 321 }] },
						{ name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{ name: "History", date: "11/05/2025", grade: 5, id: 321 }] },
					]} />
				<GradesListCard grades={userStore.grades} />
			</div>
		</main>
	</div>
}