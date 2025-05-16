const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const request = async (method: "POST" | "GET", path: string, data?: object | undefined | null) => {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (getCookie("auth_token") || "")
        },
        credentials: "same-origin"
    }

    if (data) 
        options.body = JSON.stringify(data)
    
    const response = await fetch(`${BASE_URL}${path}`, options)
    if (response.status == 401 && document.location.href.indexOf("/login") == -1) {
        document.location.href = "/";
    }

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }

    return response.json();
};

export const fetcher = (url: string) => request("GET", url)