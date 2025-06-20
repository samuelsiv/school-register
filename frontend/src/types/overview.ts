import { Grade } from "./grade";
import { Student } from "./student";
import {Homework} from "@/types/homework";

export type Overview =
    {
        student: Student & {coordinatorId: number | null},
        parents: {
            parentId: string,
            name: string,
            surname: string,
            email: string,
        }[],
        allGrades: Grade[],
        average: number | null,
        averagesByDay: number | null,
        averagesBySubject: number | null,
        events: Event[],
        homeworks: Homework[],
    } | null
