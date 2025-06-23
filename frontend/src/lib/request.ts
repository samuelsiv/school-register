const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const ignoredPaths = [
    "/",
    "/login",
]

export const request = async (method: "POST" | "GET" | "PATCH", path: string, options?: {
    auth?: string | null
    data?: object | undefined | null
} | null) => {
    const reqOptions: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (options?.auth || getCookie("auth_token") || "")
        },
        credentials: "same-origin"
    }

    if (options?.data)
        reqOptions.body = JSON.stringify(options.data)

    const response = await fetch(`${BASE_URL}${path}`, reqOptions)
    if (response.status == 401 && !ignoredPaths.includes(window.location.pathname)) {
        document.location.href = "/";
        return;
    }

    //if (!response.ok) {
    //    throw new Error(`Error: ${response.statusText}`)
    //}

    return response.json();
};

export const fetcher = (url: string) => request("GET", url)