"use client";

import { fetcher } from "@/lib/request";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import {ExtendedUserInfo, UserInfo} from "@/types/userInfo";

const AdminStore = createContainer(() => {
	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [students, setStudents] = useState<ExtendedUserInfo[]>([]);
	const [teachers, setTeachers] = useState<ExtendedUserInfo[]>([]);


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

	useEffect(() => {
		if (userData) {
			setUserId(userData.user.userId);
			setName(userData.user.name);
		}
	}, [userData]);

	const { data: usersList } = useSWR<{
		users: ExtendedUserInfo[]
	}>("/api/v1/admin/users", fetcher, { keepPreviousData: true });

	useEffect(() => {
		if (usersList) {
			setStudents(usersList.users.filter(user => user.studentId !== null));
			
		}
	}, [usersList]);


	return {
		userId,
		name,
		students,
		teachers
	};
});

export default AdminStore;
