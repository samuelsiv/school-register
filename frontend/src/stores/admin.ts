"use client";

import {fetcher, request} from "@/lib/request";
import { useEffect, useState } from "react";
import useSWR, {preload} from "swr";
import { createContainer } from "unstated-next";
import {ExtendedUserInfo, UserInfo} from "@/types/userInfo";
import {redirect} from "next/navigation";
import {Class, ClassRes} from "@/types/class";
import {Student} from "@/types/student";
import {Grade} from "@/types/grade";
import {Homework} from "@/types/homework";
import {Overview} from "@/types/overview";

const AdminStore = createContainer(() => {
	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [students, setStudents] = useState<ExtendedUserInfo[]>([]);
	const [selectedUserInfo, setselectedUserInfo] = useState<Overview>(null);
	const [classes, setClasses] = useState<Class[]>([]);
	const [teachers, setTeachers] = useState<ExtendedUserInfo[]>([]);
	const [selectedUser, setSelectedUser] = useState<ExtendedUserInfo | null>(null)


	const { data: userData } = useSWR<{
		success: boolean;
		user: UserInfo;
	}>("/api/v1/user/info", fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (userData) {
			if (userData.user.role !== "admin") {
				redirect("/");
			}
			setUserId(userData.user.userId);
			setName(userData.user.name);
		}
	}, [userData]);

	const [reloadCount, setReloadCount] = useState(0)

	const { data: usersList } = useSWR<{
		users: ExtendedUserInfo[]
	}>(reloadCount >= 0 ? "/api/v1/admin/users" : null, fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (usersList?.users) {
			setStudents(usersList.users.filter(user => user.studentId !== null));
			setTeachers(usersList.users.filter(user => user.teacherId !== null));
		}
	}, [usersList]);

	const { data: studentData } = useSWR<Overview>(selectedUser != null ? (reloadCount >= 0 ? `/api/v1/admin/students/${selectedUser?.studentId}/overview` : null ) : null, fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (studentData != null) {
			setselectedUserInfo(studentData);
		}
	}, [studentData]);

	const reloadStudents = () => {
		setReloadCount(reloadCount + 1)
	}

	const { data: classList } = useSWR<ClassRes>(reloadCount >= 0 ? "/api/v1/admin/classes" : null, fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (classList?.allClasses) {
			setClasses(classList.allClasses);
		}
	}, [classList]);

	const assignClass = (classId: string) => {
		console.log(classId)
		request("POST", "/api/v1/admin/students/" + selectedUser?.studentId + "/link-to-class", {
			data: {
				classId: parseInt(classId)
			}
		}).finally(() => {
			setReloadCount(reloadCount + 1)
		})
	}
	return {
		userId,
		name,
		students,
		teachers,
		classes,
		reloadStudents,
		selectedUser, setSelectedUser, selectedUserInfo,
		assignClass
	};
});

export default AdminStore;
