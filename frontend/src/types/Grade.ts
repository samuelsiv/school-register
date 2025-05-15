export type Grade = {
    gradeId: number,
    studentId: number,
    teacherId: number,
    subjectId: number,
    value: number,
    weight: number, // 50%, 100%
    insertedAt: string,
    comment: string,
}