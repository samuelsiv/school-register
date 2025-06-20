const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;

export const calculateGeneralAverage = (grades: Array<{
    gradeId: number, subjectName: string
    studentId: number, teacherId: number,
    subjectId: number, value: number,
    weight: number, insertedAt: string | null,
    comment: string | null, teacherName: string,
}>) => grades.length == 0 ? null :
    Math.round(average(grades
        .filter((grade) => grade.weight != 0)
        .map((grade) => grade.value * (grade.weight / 100)),
    ) * 100) / 100;

export const calculateAveragesByDay = (grades: Array<{
    gradeId: number, subjectName: string
    studentId: number, teacherId: number,
    subjectId: number, value: number,
    weight: number, insertedAt: string | null,
    comment: string | null, teacherName: string,
}>) => grades.length == 0 ? [] :
    [...new Map(grades
        .filter((grade) => grade.weight != 0)
        .map((v) => [Date.parse(v.insertedAt!), v])).values()]
        .map((grade) => {
            const date = Date.parse(grade.insertedAt!);

            const beforeGrades = grades
                .filter((grade2) => Date.parse(grade2.insertedAt!) <= date)
                .map((grade) => grade.value * (grade.weight / 100));

            return {date, average: average(beforeGrades)};
        })
        .map((average) => ({...average, average: Math.round(average.average * 100) / 100}));

export const calculateAveragesBySubject = (grades: Array<{
    gradeId: number, subjectName: string
    studentId: number, teacherId: number,
    subjectId: number, value: number,
    weight: number, insertedAt: string | null,
    comment: string | null, teacherName: string,
}>) => grades.length == 0 ? [] :
    [...new Map(grades
        .filter((grade) => grade.weight != 0)
        .map((v) => [v.subjectId, v])).values()]
        .map((grade) => {
            const subjectGrades = grades
                .filter((grade2) => grade2.subjectId == grade.subjectId);

            return {
                subject: grade.subjectName,
                subjectId: grade.subjectId,
                teacherId: grade.teacherId,
                teacher: grade.teacherName,
                average: average(
                    subjectGrades.map((grade) => grade.value * (grade.weight / 100)),
                ),
                grades: subjectGrades,
            };
        })
        .map((average) => ({...average, average: Math.round(average.average * 100) / 100}));
