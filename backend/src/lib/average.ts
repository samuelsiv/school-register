const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;

export const calculateGeneralAverage = (grades: Array<{
  gradeId: number, subjectName: string
  studentId: number, teacherId: number,
  subjectId: number, value: number,
  weight: number, insertedAt: string | null,
  comment: string | null, teacherName: string,
}>) => grades.length === 0 ? null :
  Math.round(average(grades
    .filter((grade) => grade.weight !== 0)
    .map((grade) => grade.value * (grade.weight / 100)),
  ) * 100) / 100;

export const calculateAveragesByDay = (grades: Array<{
  gradeId: number, subjectName: string
  studentId: number, teacherId: number,
  subjectId: number, value: number,
  weight: number, insertedAt: string | null,
  comment: string | null, teacherName: string,
}>) => grades.length === 0 ? [] :
  [...new Map(grades
    .filter((grade) => grade.weight !== 0)
    .map((v) => [Date.parse(v.insertedAt!), v])).values()]
    .map((grade) => {
      const date = Date.parse(grade.insertedAt!);

      const beforeGrades = grades
        .filter((g) => Date.parse(g.insertedAt!) <= date)
        .map((g) => g.value * (g.weight / 100));

      return {date, average: average(beforeGrades)};
    })
    .map((a) => ({...average, average: Math.round(a.average * 100) / 100}));

export const calculateAveragesBySubject = (grades: Array<{
  gradeId: number, subjectName: string
  studentId: number, teacherId: number,
  subjectId: number, value: number,
  weight: number, insertedAt: string | null,
  comment: string | null, teacherName: string,
}>) => grades.length === 0 ? [] :
  [...new Map(grades
    .filter((g) => g.weight !== 0)
    .map((v) => [v.subjectId, v])).values()]
    .map((grade) => {
      const subjectGrades = grades
        .filter((g) => g.subjectId === grade.subjectId);

      return {
        average: average(
          subjectGrades.map((g) => g.value * (g.weight / 100)),
        ),
        grades: subjectGrades,
        subject: grade.subjectName,
        subjectId: grade.subjectId,
        teacher: grade.teacherName,
        teacherId: grade.teacherId,
      };
    })
    .map((a) => ({...a, average: Math.round(a.average * 100) / 100}));
