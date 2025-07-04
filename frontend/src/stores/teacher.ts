"use client";

import {fetcher, request} from "@/lib/request";
import {Student} from "@/types/student";
import {redirect, useParams} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {createContainer} from "unstated-next";
import {UserInfo} from "@/types/userInfo";
import {ClassRes} from "@/types/class";
import {Overview} from "@/types/overview";
import {Teacher} from "@/types/teacher";
import {SchoolEvent} from "@/types/event";
import {EventType} from "@/types/eventType";
import {Subject} from "@/types/subject";
import {Homework} from "@/types/homework";

const API_ENDPOINTS = {
  user: "/api/v1/user",
  teacherClasses: "/api/v1/teachers/classes",
  schoolTeachers: "/api/v1/teachers",
  classStudents: (classId: string) => `/api/v1/teachers/classes/${classId}/students`,
  classHomeworks: (classId: string) => `/api/v1/teachers/classes/${classId}/homeworks`,
  eventsStudents: (classId: string) => `/api/v1/teachers/classes/${classId}/students/events`,
  studentOverview: (classId: string, studentId: number) => `/api/v1/teachers/classes/${classId}/students/${studentId}`
} as const;

const useUserAuth = () => {
  const {data: userData} = useSWR<{
    success: boolean;
    user: UserInfo;
    teacherId: number,
    assignedSubjects: Subject[]
  }>(API_ENDPOINTS.user, fetcher, {keepPreviousData: true});

  useEffect(() => {
    if (userData?.user.role !== "teacher") {
      redirect("/");
    }
  }, [userData]);

  return {
    userId: userData?.user.userId ?? null,
    teacherId: userData?.teacherId ?? null,
    name: userData?.user.name ?? null,
    assignedSubjects: userData?.assignedSubjects,
    isLoading: !userData
  };
};

const useTeacherClasses = () => {
  const {data, error} = useSWR<ClassRes>(API_ENDPOINTS.teacherClasses, fetcher, {
    keepPreviousData: true
  });

  return {
    classes: data?.allClasses ?? [],
    isLoading: !data && !error,
    error
  };
};

const useSchoolTeachers = () => {
  const {data, error} = useSWR<{ teachers: Teacher[] }>(API_ENDPOINTS.schoolTeachers, fetcher, {
    keepPreviousData: true
  });

  return {
    teachers: data?.teachers ?? [],
    isLoading: !data && !error,
    error
  };
};

const useStudentsEvents = (classId: string | null) => {
  const {data, error, mutate} = useSWR<{ eventsByStudent: Record<number, SchoolEvent[]> }>(
    classId ? API_ENDPOINTS.eventsStudents(classId) : null,
    fetcher, {
      keepPreviousData: true
    });

  return {
    events: data?.eventsByStudent ?? [],
    mutate,
    isLoading: !data && !error,
    error
  };
};

const useStudentsHomeworks = (classId: string | null) => {
  const {data, error, mutate} = useSWR<{ homeworksList: Homework[] }>(
    classId ? API_ENDPOINTS.classHomeworks(classId) : null,
    fetcher, {
      keepPreviousData: true
    });

  return {
    homeworks: data?.homeworksList ?? [],
    mutate,
    isLoading: !data && !error,
    error
  };
};

const useClassStudents = (classId: string | null) => {
  const {data, error} = useSWR<{ students: Student[] }>(
    classId ? API_ENDPOINTS.classStudents(classId) : null,
    fetcher,
    {keepPreviousData: true}
  );

  return {
    students: data?.students ?? [],
    isLoading: classId && !data && !error,
    error
  };
};

const useSelectedStudent = (classId: string | null, studentId: number | null) => {
  const {data, error} = useSWR<Overview>(
    classId && studentId
      ? API_ENDPOINTS.studentOverview(classId, studentId)
      : null,
    fetcher,
    {keepPreviousData: true}
  );

  return {
    overview: data ?? null,
    isLoading: classId && studentId && !data && !error,
    error
  };
};

const TeacherStore = createContainer(() => {
  const {classId} = useParams();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const {userId, name, teacherId, assignedSubjects} = useUserAuth();
  const {classes: teacherClasses} = useTeacherClasses();
  const {teachers: schoolTeachers} = useSchoolTeachers();
  const {students: classStudents} = useClassStudents(classId as string);

  const {events: studentsEvents, mutate: mutateEvents} = useStudentsEvents(classId as string);
  const {homeworks: studentsHomeworks, mutate: mutateHomeworks} = useStudentsHomeworks(classId as string);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const todayEvents = useMemo(() => {
    return Object.entries(studentsEvents).map(([studentId, events]) => ({
      id: studentId, events: events.filter(event => event.eventDate === selectedDate)
    })).sort((a, b) => {
      const aStud = classStudents.find(st => st.studentId === parseInt(a.id))
      const bStud = classStudents.find(st => st.studentId === parseInt(b.id))
      return (
        aStud?.surname || "" < (bStud?.surname || "") ? -1 : (aStud?.surname || "" > (bStud?.surname || "") ? 1 : 0)
      )
    });
  }, [studentsEvents, selectedDate, classStudents])

  const todayHomeworks = useMemo(() => {
    return studentsHomeworks.filter(h => h.createdAt === selectedDate || h.dueDate === selectedDate)
  }, [studentsHomeworks, selectedDate])

  const dayHours = useMemo(() => [1, 2, 3, 4, 5], [])
  const noEventsHours = useMemo(() => {
    return dayHours
      .filter(hour =>
        todayEvents
          .map(({id: _, events: e}) => e)
          .flat()
          .every(event => event.eventHour !== hour)
      )
  }, [todayEvents, dayHours])

  const tableStudents = useMemo(() => [
    ...todayEvents,
    ...classStudents.filter(
      stud => todayEvents
        .map(e => e.id)
        .indexOf(stud.studentId.toString()) === -1
    )
      .sort(
        (a, b) => a.surname < b.surname ? -1 : (a.surname > b.surname ? 1 : 0)
      )
      .map(st => {
        return {id: st.studentId.toString(), events: Array<SchoolEvent>()}
      })
  ], [todayEvents, classStudents])

  const copyEvents = (hour: number, desc: string) => {
    let toInsertEvents: SchoolEvent[]
    if (hour === 1 || noEventsHours.includes(hour - 1)) toInsertEvents = classStudents.map(student => ({
      eventDate: selectedDate,
      eventHour: 1,
      studentId: student.studentId,
      eventId: null,
      eventType: EventType.PRESENT,
      teacherId: teacherId as number,
      eventDescription: desc,
      classId: parseInt(classId as string, 10),
      teacherName: "",
    }))
    else toInsertEvents = todayEvents
      .map(e => e.events)
      .flat()
      .filter(e => e.eventHour === hour - 1)
      .map(e => {
        let newType = e.eventType
        if (newType == EventType.DELAY) newType = EventType.PRESENT
        else if (newType == EventType.LEAVE) newType = EventType.ABSENCE
        return {
          ...e, eventHour: hour,
          eventId: null, eventType: newType, eventDescription: desc
        }
      })

    request("POST", `/api/v1/teachers/classes/${classId}/students/events/createMany`, {
      data: toInsertEvents
    }).then(_ => mutateEvents())
  }

  const editEvent = (event: SchoolEvent, type: EventType, description: string) => {
    request("PATCH", `/api/v1/teachers/classes/${classId}/students/${event.studentId}/events/${event.eventId}`, {
      data: {
        eventType: type,
        eventDescription: description
      }
    }).then(_ => mutateEvents())
  }
  const editHourEvent = (eventHour: number, description: string) => {
    request("PATCH", `/api/v1/teachers/classes/${classId}/students/events`, {
      data: {
        eventDate: selectedDate,
        eventHour,
        eventDescription: description
      }
    }).then(_ => mutateEvents())
  }

  const {overview: selectedStudentInfo} = useSelectedStudent(
    classId as string,
    selectedStudent?.studentId ?? null
  );

  return {
    userId,
    name,
    teacherId,
    assignedSubjects,
    classId,
    teacherClasses,
    classStudents,
    selectedDate,
    studentsEvents,
    todayEvents,
    dayHours,
    noEventsHours,
    copyEvents,
    selectedStudent,
    setSelectedStudent,
    selectedStudentInfo,
    editEvent,
    editHourEvent,
    schoolTeachers,
    setSelectedDate,
    tableStudents,
    todayHomeworks
  };
});

export default TeacherStore;