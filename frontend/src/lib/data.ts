"use server"

export async function isDev() {
    console.log(process.env)
    return process.env.DEMO == "1"
}