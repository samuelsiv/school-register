"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Role } from "@/types/auth";
import { Student } from "@/types/student";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import {UserInfo} from "@/types/userInfo";
import {string} from "zod";
import { Grade } from "@/types/grade";

const ignoredPaths = [
	"/login",
];

const UserStore = createContainer(() => {
	if (ignoredPaths.includes(usePathname())) {
		return {
			userId: null,
			getName: () => string,
			isParent: false,

			selectedStudent: null,
			selectStudent: () => { },

			managedStudents: [],
		}
	}

	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);

	const [isParent, setIsParent] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [managedStudents, setManagedStudents] = useState<Student[]>([]);
	
	const [grades, setGrades] = useState<Grade[]>([]);

	const { data, error, isLoading } = useSWR<{
		success: boolean,
		user: UserInfo
		assignedStudents: Student[]
	}>(`/api/v1/user/info`, fetcher, { keepPreviousData: true });

	const selectStudent = (student: Student) => {
		setSelectedStudent(student);
		setJsonStore<Student>("selected_student", student);
	};

	const getName = (getParentName: boolean = false) => {
		if (isParent && !getParentName) return (selectedStudent?.name || "") + " " + (selectedStudent?.surname || "");
		return name || "";
	}

	useEffect(() => {
		if (data) {
			setUserId(data.user.userId);
			setName(data.user.name);
			setIsParent(data.user.role === "parent");

			setSelectedStudent(data.assignedStudents[0]);

			if (data.user.role === "parent") {
				setManagedStudents(data.assignedStudents);
			}
		}
	}, [data]);

	useEffect(() => {
		if (!isParent) return;

		const storedChild = getJsonStore<Student | null>("selected_student");
		if (storedChild) {
			setSelectedStudent(storedChild);
		}
	}, [isParent]);

	if (selectedStudent) {
		const { data, error, isLoading } = useSWR<Grade[]>(`/api/v1/students/${selectedStudent.studentId}/grades`, fetcher, { keepPreviousData: true });
			
		useEffect(() => {
			if (!selectedStudent) return;
			
			console.log(grades);

		}, [data]);
	}

	return {
		userId,
		getName,
		isParent,

		selectedStudent,
		selectStudent,

		managedStudents,
		grades
	}
});

export default UserStore;