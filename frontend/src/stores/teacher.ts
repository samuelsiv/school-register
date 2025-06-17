"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Student } from "@/types/student";
import {useParams, usePathname} from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { UserInfo } from "@/types/userInfo";
import { Grade, GradeResponse } from "@/types/grade";
import { Homework } from '@/types/homework'
import {Class, ClassRes} from "@/types/class";

const TeacherStore = createContainer(() => {
	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);

	const { classId } = useParams()

	const [classStudents, setClassStudents] = useState<Student[]>([]);

	const { data: userData } = useSWR<{
		success: boolean;
		user: UserInfo;
	}>("/api/v1/user/info", fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (userData) {
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

	const { data: classStudentsData } = useSWR<{ 
		students: Student[]
	}>(
		`/api/v1/teachers/classes/${classId}/students`,
		fetcher,
		{ keepPreviousData: true }
	);

	useEffect(() => {
		if (classStudentsData) {
			setClassStudents(classStudentsData.students);
		}
	}, [classStudentsData]);

	return {
		userId,
		name,
		teacherClasses,
		classStudents
	};
});

export default TeacherStore;
