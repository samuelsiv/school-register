"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Student } from "@/types/student";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { UserInfo } from "@/types/userInfo";
import { Grade, GradeResponse } from "@/types/grade";

const ignoredPaths = ["/login"];

const UserStore = createContainer(() => {
	const pathname = usePathname();

	if (ignoredPaths.includes(pathname)) {
		return {
			userId: null,
			getName: () => "",
			isParent: false,

			selectedStudent: null,
			selectStudent: () => {
			},

			managedStudents: [],
			grades: [],
			average: 0,
			averageByDay: [],
			averageBySubject: []
		};
	}

	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);

	const [isParent, setIsParent] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [managedStudents, setManagedStudents] = useState<Student[]>([]);
	const [grades, setGrades] = useState<Grade[]>([]);
	const [average, setAverage] = useState<number>(0);
	const [averageByDay, setAverageByDay] = useState<{ date: number, average: number }[]>([]);
	const [averageBySubject, setAverageBySubject] = useState<{ average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string }[]>([]);

	const selectStudent = (student: Student) => {
		setSelectedStudent(student);
		setJsonStore<Student>("selected_student", student);
	};

	const getName = (getParentName: boolean = false) => {
		if (isParent && !getParentName) {
			return `${selectedStudent?.name || ""} ${selectedStudent?.surname || ""}`;
		}
		return name || "";
	};

	const { data: userData } = useSWR<{
		success: boolean;
		user: UserInfo;
		assignedStudents: Student[];
	}>("/api/v1/user/info", fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (userData) {
			setUserId(userData.user.userId);
			setName(userData.user.name);
			setIsParent(userData.user.role === "parent");

			setSelectedStudent(userData.assignedStudents[0]);

			if (userData.user.role === "parent") {
				setManagedStudents(userData.assignedStudents);
			}
		}
	}, [userData]);

	useEffect(() => {
		if (!isParent) return;

		const storedChild = getJsonStore<Student | null>("selected_student");
		if (storedChild) {
			setSelectedStudent(storedChild);
		}
	}, [isParent]);

	const { data: gradesData } = useSWR<GradeResponse>(
		selectedStudent ? `/api/v1/students/${selectedStudent.studentId}/grades` : null,
		fetcher,
		{ keepPreviousData: true }
	);
	
	useEffect(() => {
		if (gradesData) {
			setGrades(gradesData.allGrades.reverse());
			setAverage(gradesData.average);
			setAverageByDay(gradesData.averagesByDay)
			setAverageBySubject(gradesData.averagesBySubject)
		}
	}, [gradesData]);

	return {
		userId,
		getName,
		isParent,

		selectedStudent,
		selectStudent,

		managedStudents,
		grades,
		average,
		averageByDay,
		averageBySubject
	};
});

export default UserStore;
