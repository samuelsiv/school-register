const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

const request = async (method: "POST" | "GET", path: string, data?: object | undefined | null) => {
    const options: {
        method: string;
        headers: {
            "Content-Type": string;
            "Authorization"?: string;
        };
        body?: string | undefined;
    } = {
        method,
        headers: {
            "Content-Type": "application/json",
        }
    }

    const token = localStorage.getItem("access_token");
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) 
        options.body = JSON.stringify(data)
    
    const response = await fetch(`${BASE_URL}${path}`, options)
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }

    return response.json();
};