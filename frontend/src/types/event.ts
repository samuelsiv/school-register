import {EventType} from "@/types/eventType";

export type SchoolEvent = {
    eventId: number | null,
    eventDate: string,
    eventType: EventType,
    studentId: number,
    teacherId: number,
    eventDescription: string,
    eventHour: number,
    classId: number
}