"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Student } from "@/types/student";
import {redirect, useParams, usePathname} from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import {ExtendedUserInfo, UserInfo} from "@/types/userInfo";
import { Grade, GradeResponse } from "@/types/grade";
import { Homework } from '@/types/homework'
import {Class, ClassRes} from "@/types/class";
import {Overview} from "@/types/overview";
import {Teacher} from "@/types/teacher";

const TeacherStore = createContainer(() => {
	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
	const [schoolTeachers, setSchoolTeachers] = useState<Teacher[]>([]);
	const [selectedUser, setSelectedUser] = useState<Student | null>(null)
	const [selectedUserInfo, setselectedUserInfo] = useState<Overview>(null);

	const { classId } = useParams()

	const [classStudents, setClassStudents] = useState<Student[]>([]);

	const { data: userData } = useSWR<{
		success: boolean;
		user: UserInfo;
	}>("/api/v1/user/info", fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (userData) {
			if (userData.user.role !== "teacher") {
				redirect("/");
			}
			setUserId(userData.user.userId);
			setName(userData.user.name);
		}
	}, [userData]);


	const { data: teacherClassesData } = useSWR<ClassRes>(
		`/api/v1/teachers/classes`,
		fetcher,
		{ keepPreviousData: true }
	);


	useEffect(() => {
		if (teacherClassesData) {
			setTeacherClasses(teacherClassesData.allClasses);
		}
	}, [teacherClassesData]);

	const { data: schoolTeachersData } = useSWR<{
		teachers: Teacher[]
	}>(
		`/api/v1/teachers/teachers`,
		fetcher,
		{ keepPreviousData: true }
	);


	useEffect(() => {
		if (schoolTeachersData) {
			setSchoolTeachers(schoolTeachersData.teachers);
		}
	}, [schoolTeachersData]);

	const { data: classStudentsData } = useSWR<{ 
		students: Student[]
	}>(
		classId != null ? `/api/v1/teachers/classes/${classId}/students` : null,
		fetcher,
		{ keepPreviousData: true }
	);

	useEffect(() => {
		if (classStudentsData) {
			setClassStudents(classStudentsData.students);
		}
	}, [classStudentsData]);

	const { data: studentData } = useSWR<Overview>(selectedUser != null ? `/api/v1/teachers/classes/${classId}/${selectedUser?.studentId}/overview` : null, fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (studentData != null) {
			setselectedUserInfo(studentData);
		}
	}, [studentData]);

	return {
		userId,
		name,
		teacherClasses,
		classStudents, selectedUser, setSelectedUser, selectedUserInfo, classId,
		schoolTeachers,
	};
});

export default TeacherStore;
