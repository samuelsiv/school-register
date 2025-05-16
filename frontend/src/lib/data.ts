import useSWR from "swr";
import {fetcher} from "@/lib/request";
import {UserInfo} from "@/types/userInfo";
import {Student} from "@/types/student";
import {Grade} from "@/types/grade";

export function useUserInfo(): {userInfo: { success: boolean, user: UserInfo, students: Student[] } | null, isLoading: boolean, isError: boolean} {
    const { data, error, isLoading } = useSWR(`/api/v1/user/info`, fetcher, { keepPreviousData: true })

    return {
        userInfo: data,
        isLoading,
        isError: error
    }
}

export function useGrades(): {grades: Grade[] | null, isLoadingGrades: boolean, isErrorGrades: boolean} {
    const { data, error, isLoading } = useSWR(`/api/v1/students/grades`, fetcher, { keepPreviousData: true })

    return {
        grades: data,
        isLoadingGrades: isLoading,
        isErrorGrades: error
    }
}