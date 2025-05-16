"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Student } from "@/types/student";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { usePathname } from 'next/navigation'

const ignorePaths = [
	"/login"	
]

const UserStore = createContainer(() => {
	console.log("UserStore");
	if (ignorePaths.includes(usePathname())) {
		return {
			userId: null,
			getName: () => null,
			isParent: false,
			selectedStudent: null,
			selectStudent: () => {},
			managedStudents: [],
		}
	}

	const [userId, setUserId] = useState(null);
	const [name, setName] = useState(null);

	const [isParent, setIsParent] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [managedStudents, setManagedStudents] = useState<Student[]>([]);

	const { data, error, isLoading } = useSWR(`/api/v1/user/info`, fetcher);

	const selectStudent = (student: Student) => {
		setSelectedStudent(student);
		setJsonStore<Student>("selected_student", student);
	};

	const getName = (getParentName: boolean = false) => {
		if (isParent && !getParentName) return selectedStudent?.fullName!;
		return name!;
	}

	useEffect(() => {
		if (data) {
			setUserId(data.user.userId);
			setName(data.user.name);
			setIsParent(data.user.role === "parent");

			setSelectedStudent(data.user.assignedStudents[0]);

			if (data.user.role === "parent") {
				setManagedStudents(data.user.assignedStudents);
			}
		}
	}, []);

	useEffect(() => {
		if (!isParent) return;

		const storedChild = getJsonStore<Student | null>("selected_student");
		if (storedChild) {
			setSelectedStudent(storedChild);
		}
	}, [isParent]);

	return {
		userId,
		getName,
		isParent,

		selectedStudent,
		selectStudent,

		managedStudents,
	}
});

export default UserStore;