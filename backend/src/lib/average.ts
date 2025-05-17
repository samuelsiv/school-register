const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;

export const calculateGeneralAverage = (grades: {
    gradeId: number, subjectName: string
    studentId: number, teacherId: number,
    subjectId: number, value: number,
    weight: number, insertedAt: string | null,
    comment: string | null, teacherName: string
}[]) =>
    average(grades
        .filter((grade) => grade.weight != 0)
        .map((grade) => grade.value * (grade.weight / 100))
    )

export const calculateAveragesByDay = (grades: {
    gradeId: number, subjectName: string
    studentId: number, teacherId: number,
    subjectId: number, value: number,
    weight: number, insertedAt: string | null,
    comment: string | null, teacherName: string
}[]) =>
    grades
        .filter((grade) => grade.weight != 0)
        .map((grade) => {
            let date = Date.parse(grade.insertedAt!)

            const beforeGrades = grades
                .filter((grade2) => Date.parse(grade2.insertedAt!) <= date)
                .map((grade) => grade.value * (grade.weight / 100))

            return {date, average: average(beforeGrades)}
        })
        //.map((grade) => grade.value * (grade.weight / 100))

