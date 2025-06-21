"use client";

import { fetcher } from "@/lib/request";
import { Student } from "@/types/student";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { UserInfo } from "@/types/userInfo";
import { Class, ClassRes } from "@/types/class";
import { Overview } from "@/types/overview";
import { Teacher } from "@/types/teacher";

const API_ENDPOINTS = {
  user: "/api/v1/user",
  teacherClasses: "/api/v1/teachers/classes",
  schoolTeachers: "/api/v1/teachers",
  classStudents: (classId: string) => `/api/v1/teachers/classes/${classId}/students`,
  studentOverview: (classId: string, studentId: number) => `/api/v1/teachers/classes/${classId}/${studentId}/overview`
} as const;

const useUserAuth = () => {
  const { data: userData } = useSWR<{
    success: boolean;
    user: UserInfo;
  }>(API_ENDPOINTS.user, fetcher, { keepPreviousData: true });

  useEffect(() => {
    if (userData?.user.role !== "teacher") {
      redirect("/");
    }
  }, [userData]);

  return {
    userId: userData?.user.userId ?? null,
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
  const { classId } = useParams();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { userId, name } = useUserAuth();
  const { classes: teacherClasses } = useTeacherClasses();
  const { teachers: schoolTeachers } = useSchoolTeachers();
  const { students: classStudents } = useClassStudents(classId as string);
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
    
    selectedStudent,
    setSelectedStudent,
    selectedStudentInfo,
    
    schoolTeachers,
  };
});

export default TeacherStore;