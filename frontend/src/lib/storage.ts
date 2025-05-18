"use client"

export function getStore(key: string): string | null {
    return localStorage.getItem(key)
}

export function getJsonStore<T = any>(key: string): T | null {
    try {
        const value = localStorage.getItem(key);
        return (value === null || value === "") ? null : JSON.parse(value) as T;
    } catch (error) {
        return null;
    }
}

export function setStore(key: string, value: string): void {
    localStorage.setItem(key, value)
}

export function setJsonStore<T = any>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
}