"use client"

export function getStore(key: string): string | null {
  return localStorage.getItem(key)
}

export function getJsonStore<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return (value === null || value === "") ? null : JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setStore(key: string, value: string): void {
  localStorage.setItem(key, value)
}

export function setJsonStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}