"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import UserStore from "@/stores/user";
import {Calendar} from "@/components/ui/calendar";
import HomeworkCard from "@/components/cards/homeworks/HomeworkCard";
import {Homework} from "@/types/homework";
import {useMemo, useState} from "react";
import {Card} from "@/components/ui/card";
import HomeworkExpandedCard from "@/components/cards/homeworks/HomeworkExpandedCard";

export default function Homeworks() {
  const userStore = UserStore.useContainer();
  //const { grades, isLoadingGrades, isErrorGrades } = useGrades()
  const [selectedDay, setDay] = useState<Date>(new Date())
  // filter me the homeworks based on the month
  const monthHomeworks = useMemo(() =>
    userStore.homeworks.filter(homework => {
      const homeworkDate = new Date(homework.dueDate);
      return !isNaN(homeworkDate.getTime()) &&
        homeworkDate.getMonth() === selectedDay.getMonth() &&
        homeworkDate.getFullYear() === selectedDay.getFullYear();
    }), [userStore.homeworks, selectedDay]
  );

  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)

  return <div
    className="w-full  text-foreground flex items-center p-3 gap-6 text-center h-full">
    <AppSidebar/>

    <main className="flex flex-col w-full items-center justify-center gap-6">
      <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
        <SidebarTrigger/>
        <div>
          <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">Homeworks</h1>
          <h2 className="scroll-m-20 text-xl align-center tracking-tight">These are your homeworks, make sure
            to do them all!</h2>
        </div>
        <br/>
      </div>
      {userStore.isParent && userStore.selectedStudent != null &&
          <KidInfoAlert name={userStore.selectedStudent.name}/>
      }
      <Card className="border-t-[2px]">
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

      <div className="grid grid-rows-2 grid-cols-3 gap-12 w-full">
        {selectedHomework == null && monthHomeworks.map((homework: Homework) =>
          <HomeworkCard homework={homework}
                        key={"hw-" + homework.homeworkId}
                        onArrowClick={() => {
                            setSelectedHomework(homework)
                        }}/>)
        }
        {(selectedHomework != null) &&
            <HomeworkExpandedCard homework={selectedHomework} goBack={() => setSelectedHomework(null)}/>}
      </div>
    </main>
  </div>
}