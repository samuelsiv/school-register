import useSWR from "swr";
import {fetcher} from "@/lib/request";
import {UserInfo} from "@/types/UserInfo";

export function useUserInfo(): {userInfo: { success: boolean, user: UserInfo }, isLoading: boolean, isError: boolean} {
    const { data, error, isLoading } = useSWR(`/api/v1/user/info`, fetcher)

    return {
        userInfo: data,
        isLoading,
        isError: error
    }
}