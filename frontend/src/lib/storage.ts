"use client"

export function getStore(key: string): string | null {
    return localStorage.getItem(key)
}

export function getJsonStore(key: string): (any | null) {
    let res = localStorage.getItem("a")
    return (res == "" || res == null) ? null : JSON.parse(res)
}