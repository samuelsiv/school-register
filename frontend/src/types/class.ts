export type Class = {
    classId: number,
    className: string,
    schoolYear: string,
    coordinator: string,
    studentCount: number
}

export type ClassRes = {allClasses: Class[]}