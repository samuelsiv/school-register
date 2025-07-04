"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {CheckCircle, ChevronLeftCircleIcon, ChevronRightCircleIcon, CopyIcon, EditIcon, SlashIcon} from "lucide-react";
import {useState} from "react";
import {Homework} from "@/types/homework";
import HomeworkCard from "@/components/cards/homeworks/HomeworkCard";
import HomeworkExpandedCard from "@/components/cards/homeworks/HomeworkExpandedCard";
import UserStore from "@/stores/user";
import { AppSidebar } from "@/components/AppSidebar";
import {Card} from "@/components/ui/card";
import EventTypeIndicator from "@/components/misc/EventTypeIndicator";

export default function StudentTodayPage() {
  const userStore = UserStore.useContainer();
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)
  console.log(userStore.todayEvents)
  return <div
    className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
    <AppSidebar/>
    <main className="flex flex-col w-full items-center h-full justify-center gap-6">
      <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
        <SidebarTrigger/>
        <div>
          <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">
            Today
          </h1>
          <h2 className="scroll-m-20 text-xl align-center tracking-tight">Check what has been done today (and the whole year)</h2>
        </div>
        <br/>
      </div>
      <div className={"w-full flex-row flex justify-between"}>
        <ChevronLeftCircleIcon onClick={() => {
          const currDate = new Date(userStore.selectedDate)
          currDate.setDate(currDate.getDate() - 1)
          userStore.setSelectedDate(currDate.toISOString().split("T")[0])
          setSelectedHomework(null)
        }}/>
        {userStore.selectedDate.split("-").reverse().join("/")}
        <ChevronRightCircleIcon onClick={() => {
          const currDate = new Date(userStore.selectedDate)
          currDate.setDate(currDate.getDate() + 1)
          userStore.setSelectedDate(currDate.toISOString().split("T")[0])
          setSelectedHomework(null)
        }}/>
      </div>
      <div className="w-full h-full gap-12">
        <div>
          {userStore.todayEvents.map(event => <Card className="border-1 mb-4" key={"event-" + event.eventId}>
            <div className="flex flex-row justify-between px-4 py-2">
              <div className="flex flex-row gap-4 w-full text-start">
                <EventTypeIndicator type={event.eventType} setType={() => {}} isGray={false}/>
                <div className="flex flex-col gap-2">
                  <p className="text-md md:text-lg font-bold w-full">{event.teacherName}</p>
                  <p className={`text-sm font-light w-full ${event.eventDescription == "" ? "italic" : ""}`}>{event.eventDescription || "Nessuna descrizione"}</p>
                </div>
              </div>
              <p className="text-lg font-normal w-full text-end">{event.eventHour}^ hour</p>
            </div>
          </Card>)}
          {userStore.todayEvents.length === 0 && <Card className="w-full mt-4 col-span-3 h-full flex align-center items-center justify-center flex-col gap-4">
              <SlashIcon size="36"/>
              <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No events for today (maybe?)</h2>
          </Card>}
        </div>

        <div className="flex flex-row justify-center gap-6 w-full mt-8">
          <h2 className="scroll-m-20 text-2xl align-center tracking-tight">Homeworks</h2>
        </div>
        <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
          {selectedHomework == null && userStore.todayHomeworks.map((homework: Homework) => <HomeworkCard
            homework={homework} key={"hw-" + homework.homeworkId} onArrowClick={() => {
            setSelectedHomework(homework)
          }}/>)}
          {(selectedHomework != null) &&
              <HomeworkExpandedCard homework={selectedHomework} goBack={() => setSelectedHomework(null)}/>}
          {userStore.todayHomeworks.length === 0 && <Card className="w-full mt-4 col-span-3 h-full flex align-center items-center justify-center flex-col gap-4">
              <CheckCircle size="36"/>
              <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No homeworks for today!</h2>
          </Card>}
        </div>
      </div>
    </main>
  </div>
}