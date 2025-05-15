import useSWR from "swr";
import {fetcher} from "@/lib/request";
import {UserInfo} from "@/types/UserInfo";
import {Student} from "@/types/Student";
import {Grade} from "@/types/Grade";

export function useUserInfo(): {userInfo: { success: boolean, user: UserInfo, students: Student[] } | null, isLoading: boolean, isError: boolean} {
    const { data, error, isLoading } = useSWR(`/api/v1/user/info`, fetcher)

    return {
        userInfo: data,
        isLoading,
        isError: error
    }
}

export function useGrades(): {grades: Grade[] | null, isLoadingGrades: boolean, isErrorGrades: boolean} {
    const { data, error, isLoading } = useSWR(`/api/v1/students/grades`, fetcher)

    return {
        grades: data,
        isLoadingGrades: isLoading,
        isErrorGrades: error
    }
}