export type Grade = {
    gradeId: number,
    studentId: number,
    teacherId: number,
    subjectId: number,
    value: number,
    weight: number, // 50%, 100%
    insertedAt: string,
    comment: string,
    subjectName: string,
    teacherName: string
}

export type GradeResponse = {
    allGrades: Grade[],
    average: number,
    averagesByDay: {date: number, average: number}[]
}