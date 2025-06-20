export type UserInfo = {
    userId: number,
    name: string,
    surname: string,
    username: string,
    email: string,
    role: string,
    creationDate: string,
    lastLoginDate: string,
}

export type ExtendedUserInfo = {
    studentId: number | null,
    teacherId: number | null,
} & UserInfo

export type NewUser = {
    email: string;
    password: string;
    username: string;
    name: string;
    surname: string;
    role: "student" | "teacher";
}