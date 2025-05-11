import {NextRequest} from "next/server";
import {jwtVerify} from "jose"
export const isLogged = async (request: NextRequest) => {
    const schoolToken = request.cookies.get("schoolAuth")?.value
    if (schoolToken == undefined) return false

    try {
        await jwtVerify(schoolToken, new TextEncoder().encode(process.env.JWT_SECRET || ""));
        return true
    } catch (err) {
        console.log(err)

        return false
    }
}