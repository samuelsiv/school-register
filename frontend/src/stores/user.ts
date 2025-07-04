"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Student } from "@/types/student";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { UserInfo } from "@/types/userInfo";
import { GradeResponse } from "@/types/grade";
import { Homework } from '@/types/homework';
import { redirect } from "next/navigation";

const API_ENDPOINTS = {
  user: "/api/v1/user",
  studentGrades: (studentId: number) => `/api/v1/students/${studentId}/grades`,
  studentHomeworks: (studentId: number) => `/api/v1/students/${studentId}/homeworks`
} as const;

const useUserAuth = () => {
  const { data: userData } = useSWR<{
    success: boolean;
    user: UserInfo;
    assignedStudents: Student[];
  }>(API_ENDPOINTS.user, fetcher, { keepPreviousData: true });

  useEffect(() => {
    if (userData && !["parent", "student"].includes(userData.user.role)) {
      redirect("/");
    }
  }, [userData]);

  return {
    user: userData?.user ?? null,
    assignedStudents: userData?.assignedStudents ?? [],
    isLoading: !userData
  };
};

const useStudentGrades = (studentId: number | null) => {
  const { data, error } = useSWR<GradeResponse>(
    studentId ? API_ENDPOINTS.studentGrades(studentId) : null,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    grades: data?.allGrades?.reverse() ?? [],
    average: data?.average ?? 0,
    averageByDay: data?.averagesByDay ?? [],
    averageBySubject: data?.averagesBySubject ?? [],
    isLoading: studentId && !data && !error,
    error
  };
};

const useStudentHomeworks = (studentId: number | null) => {
  const { data, error } = useSWR<Homework[]>(
    studentId ? API_ENDPOINTS.studentHomeworks(studentId) : null,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    homeworks: data ?? [],
    isLoading: studentId && !data && !error,
    error
  };
};

const UserStore = createContainer(() => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { user, assignedStudents, isLoading: userLoading } = useUserAuth();
  
  const isParent = user?.role === "parent";
  const isStudent = user?.role === "student";
  const managedStudents = isParent ? assignedStudents : [];
  
  const activeStudent = isParent ? selectedStudent : assignedStudents[0] || null;
  
  const { grades, average, averageByDay, averageBySubject } = useStudentGrades(
    activeStudent?.studentId ?? null
  );
  const { homeworks } = useStudentHomeworks(activeStudent?.studentId ?? null);

  // Initialize selected student
  useEffect(() => {
    if (!user || userLoading) return;

    if (isParent) {
      const storedStudent = getJsonStore<Student | null>("selected_student");
      const validStoredStudent = storedStudent && 
        assignedStudents.some(s => s.studentId === storedStudent.studentId) 
          ? storedStudent 
          : null;
      
      setSelectedStudent(validStoredStudent || assignedStudents[0] || null);
    } else if (isStudent) {
      setSelectedStudent(assignedStudents[0] || null);
    }
  }, [user, assignedStudents, userLoading, isParent, isStudent]);

  const selectStudent = (student: Student) => {
    if (!isParent) {
      console.warn("Only parents can select different students");
      return;
    }
    
    setSelectedStudent(student);
    setJsonStore<Student>("selected_student", student);
  };

  const getName = (getParentName: boolean = false) => {
    if (isParent && !getParentName && activeStudent) {
      return `${activeStudent.name} ${activeStudent.surname}`;
    }
    return user?.name ?? "";
  };

  const getDisplayName = () => {
    if (isParent && activeStudent) {
      return `${user?.name} (viewing ${activeStudent.name} ${activeStudent.surname})`;
    }
    return user?.name ?? "";
  };

  return {
    userId: user?.userId ?? null,
    name: user?.name ?? null,
    getName,
    getDisplayName,
    
    isParent,
    isStudent,
    
    managedStudents,
    selectedStudent: activeStudent,
    selectStudent,
    
    grades,
    average,
    averageByDay,
    averageBySubject,
    homeworks,
    
    isLoading: userLoading
  };
});

export default UserStore;