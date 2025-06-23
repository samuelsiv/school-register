"use client";

import {fetcher, request} from "@/lib/request";
import { Student } from "@/types/student";
import { redirect, useParams } from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { UserInfo } from "@/types/userInfo";
import { ClassRes } from "@/types/class";
import { Overview } from "@/types/overview";
import { Teacher } from "@/types/teacher";
import {SchoolEvent} from "@/types/event";
import {EventType, getDescription} from "@/types/eventType";

const API_ENDPOINTS = {
  user: "/api/v1/user",
  teacherClasses: "/api/v1/teachers/classes",
  schoolTeachers: "/api/v1/teachers",
  classStudents: (classId: string) => `/api/v1/teachers/classes/${classId}/students`,
  eventsStudents: (classId: string) => `/api/v1/teachers/classes/${classId}/students/events`,
  studentOverview: (classId: string, studentId: number) => `/api/v1/teachers/classes/${classId}/${studentId}/overview`
} as const;

const useUserAuth = () => {
  const { data: userData } = useSWR<{
    success: boolean;
    user: UserInfo;
    teacherId: number
  }>(API_ENDPOINTS.user, fetcher, { keepPreviousData: true });

  useEffect(() => {
    if (userData?.user.role !== "teacher") {
      redirect("/");
    }
  }, [userData]);

  return {
    userId: userData?.user.userId ?? null,
    teacherId: userData?.teacherId ?? null,
    name: userData?.user.name ?? null,
    isLoading: !userData
  };
};

const useTeacherClasses = () => {
  const { data, error } = useSWR<ClassRes>(API_ENDPOINTS.teacherClasses, fetcher, {
    keepPreviousData: true
  });
  
  return {
    classes: data?.allClasses ?? [],
    isLoading: !data && !error,
    error
  };
};

const useSchoolTeachers = () => {
  const { data, error } = useSWR<{ teachers: Teacher[] }>(API_ENDPOINTS.schoolTeachers, fetcher, {
    keepPreviousData: true
  });

  return {
    teachers: data?.teachers ?? [],
    isLoading: !data && !error,
    error
  };
};

const useStudentsEvents = (classId: string | null) => {
  const { data, error, mutate } = useSWR<{ eventsByStudent: Record<number, SchoolEvent[]> }>(
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

const useClassStudents = (classId: string | null) => {
  const { data, error } = useSWR<{ students: Student[] }>(
    classId ? API_ENDPOINTS.classStudents(classId) : null,
    fetcher,
    { keepPreviousData: true }
  );
  
  return {
    students: data?.students ?? [],
    isLoading: classId && !data && !error,
    error
  };
};

const useSelectedStudent = (classId: string | null, studentId: number | null) => {
  const { data, error } = useSWR<Overview>(
    classId && studentId 
      ? API_ENDPOINTS.studentOverview(classId, studentId)
      : null,
    fetcher,
    { keepPreviousData: true }
  );
  
  return {
    overview: data ?? null,
    isLoading: classId && studentId && !data && !error,
    error
  };
};

const TeacherStore = createContainer(() => {
  let { classId } = useParams();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { userId, name, teacherId } = useUserAuth();
  const { classes: teacherClasses } = useTeacherClasses();
  const { teachers: schoolTeachers } = useSchoolTeachers();
  const { students: classStudents } = useClassStudents(classId as string);

  let { events: studentsEvents, mutate: mutateEvents } = useStudentsEvents(classId as string);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const todayEvents = useMemo(() => {
    return Object.entries(studentsEvents).map(([studentId, events]) => {
      return {
        id: studentId, events: events.filter(event => event.eventDate === selectedDate)
      }
    });
  }, [studentsEvents, selectedDate])

  const dayHours = [1, 2, 3, 4, 5]
  const noEventsHours = useMemo(() => {
    return dayHours
        .filter(hour =>
            todayEvents
                .map(({id: _, events: e}) => e)
                .flat()
                .every(event => event.eventHour !== hour)
        )
  }, [todayEvents])

  const copyEvents = (hour: number, desc: string) => {
    let toInsertEvents: SchoolEvent[]
    if (hour === 1 || noEventsHours.includes(hour-1)) toInsertEvents = classStudents.map(student => ({
      eventDate: new Date().toISOString().split('T')[0],
      eventHour: 1,
      studentId: student.studentId,
      eventId: null,
      eventType: EventType.PRESENT,
      teacherId: teacherId as number,
      eventDescription: desc,
      classId: parseInt(classId as string, 10)
    }))
    else toInsertEvents = todayEvents
        .map(e => e.events)
        .flat()
        .filter(e => e.eventHour === hour-1)
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
    }).then(res => mutateEvents())
  }

  const editEvent = (event: SchoolEvent, type: EventType, description: string) => {
    request("PATCH", `/api/v1/teachers/classes/${classId}/students/${event.studentId}/events/${event.eventId}`, {
      data: {
        eventType: type,
        eventDescription: description
      }
    }).then(res => mutateEvents())
  }
  const editHourEvent = (eventHour: number, description: string) => {
    request("PATCH", `/api/v1/teachers/classes/${classId}/students/events`, {
      data: {
        eventDate: selectedDate,
        eventHour,
        eventDescription: description
      }
    }).then(res => mutateEvents())
  }

  const { overview: selectedStudentInfo } = useSelectedStudent(
    classId as string, 
    selectedStudent?.studentId ?? null
  );

  return {
    userId,
    name,
    
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
  };
});

export default TeacherStore;