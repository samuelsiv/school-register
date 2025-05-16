"use client";

import { fetcher } from "@/lib/request";
import { getJsonStore, setJsonStore } from "@/lib/storage";
import { Role } from "@/types/auth";
import { Student } from "@/types/student";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";

const ignoredPaths = [
	"/login",
];

const UserStore = createContainer(() => {
	if (ignoredPaths.includes(usePathname())) {
		return {
			userId: null,
			getName: () => null,
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

	const { data, error, isLoading } = useSWR<{
		user: {
			userId: number;
			name: string;
			role: Role;
			assignedStudents: Student[];
		}
	}>(`/api/v1/user/info`, fetcher);

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