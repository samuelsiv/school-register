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
import { Homework } from '@/types/homework'
import {Class, ClassRes} from "@/types/class";

const AdminStore = createContainer(() => {
	const [userId, setUserId] = useState<number | null>(null);
	const [name, setName] = useState<string | null>(null);


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


	return {
		userId,
		name
	};
});

export default AdminStore;
