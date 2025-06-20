"use client";

import { fetcher } from "@/lib/request";
import { useEffect, useState } from "react";
import useSWR, {preload} from "swr";
import { createContainer } from "unstated-next";
import {ExtendedUserInfo, UserInfo} from "@/types/userInfo";
import {redirect} from "next/navigation";

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
		}
	}, [usersList]);

	const reloadStudents = () => {
		setReloadCount(reloadCount + 1)
	}

	return {
		userId,
		name,
		students,
		teachers,
		reloadStudents
	};
});

export default AdminStore;
