"use client";

import { fetcher, request } from "@/lib/request";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";
import { ExtendedUserInfo, UserInfo } from "@/types/userInfo";
import { redirect } from "next/navigation";
import { Class, ClassRes } from "@/types/class";
import { Overview } from "@/types/overview";

const API_ENDPOINTS = {
  user: "/api/v1/user",
  users: "/api/v1/admin/users",
  classes: "/api/v1/admin/classes",
  studentOverview: (studentId: number) => `/api/v1/admin/students/${studentId}/overview`,
  assignClass: (studentId: number) => `/api/v1/admin/students/${studentId}/link-to-class`
} as const;

const useAdminAuth = () => {
  const { data: userData } = useSWR<{
    success: boolean;
    user: UserInfo;
  }>(API_ENDPOINTS.user, fetcher, { keepPreviousData: true });

  useEffect(() => {
    if (userData?.user.role !== "admin") {
      redirect("/");
    }
  }, [userData]);

  return {
    userId: userData?.user.userId ?? null,
    name: userData?.user.name ?? null,
    isLoading: !userData
  };
};

const useUsers = () => {
  const { data, error } = useSWR<{ users: ExtendedUserInfo[] }>(
    API_ENDPOINTS.users, 
    fetcher, 
    { keepPreviousData: true }
  );

  const users = data?.users ?? [];
  
  return {
    students: users.filter(user => user.studentId !== null),
    teachers: users.filter(user => user.teacherId !== null),
    allUsers: users,
    isLoading: !data && !error,
    error
  };
};

const useClasses = () => {
  const { data, error } = useSWR<ClassRes>(
    API_ENDPOINTS.classes, 
    fetcher, 
    { keepPreviousData: true }
  );
  
  return {
    classes: data?.allClasses ?? [],
    isLoading: !data && !error,
    error
  };
};

const useSelectedStudentOverview = (studentId: number | null) => {
  const { data, error } = useSWR<Overview>(
    studentId ? API_ENDPOINTS.studentOverview(studentId) : null,
    fetcher,
    { keepPreviousData: true }
  );
  
  return {
    overview: data ?? null,
    isLoading: studentId && !data && !error,
    error
  };
};

const AdminStore = createContainer(() => {
  const [selectedUser, setSelectedUser] = useState<ExtendedUserInfo | null>(null);
  
  const { userId, name } = useAdminAuth();
  const { students, teachers, allUsers } = useUsers();
  const { classes } = useClasses();
  const { overview: selectedUserInfo } = useSelectedStudentOverview(
    selectedUser?.studentId ?? null
  );

  const reloadUsers = async () => {
    await mutate(API_ENDPOINTS.users);
  };

  const assignClass = async (classId: string) => {
    if (!selectedUser?.studentId) {
      console.error("No student selected");
      return;
    }

    try {
      await request("POST", API_ENDPOINTS.assignClass(selectedUser.studentId), {
        data: { classId: parseInt(classId) }
      });
      
      await Promise.all([
        mutate(API_ENDPOINTS.users),
        mutate(API_ENDPOINTS.studentOverview(selectedUser.studentId))
      ]);
    } catch (error) {
      console.error("Failed to assign class:", error);
    }
  };

  const selectUser = (user: ExtendedUserInfo | null) => {
    setSelectedUser(user);
  };

  return {
    userId,
    name,
    
    students,
    teachers,
    classes,
    
    selectedUser,
    selectedUserInfo,
    
    setSelectedUser: selectUser,
    reloadStudents: reloadUsers,
    assignClass,
  };
});

export default AdminStore;