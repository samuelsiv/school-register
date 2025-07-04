CREATE TABLE "classes"
(
    "class_id"               serial PRIMARY KEY NOT NULL,
    "class_name"             varchar(255)       NOT NULL,
    "school_year"            varchar(50),
    "coordinator_teacher_id" integer,
    CONSTRAINT "classes_class_name_unique" UNIQUE ("class_name")
);

CREATE TABLE "events"
(
    "event_id"          serial PRIMARY KEY NOT NULL,
    "student_id"        integer            NOT NULL,
    "teacher_id"        integer,
    "event_date"        date               NOT NULL,
    "event_hour"        smallint           NOT NULL,
    "event_type"        varchar(50)        NOT NULL,
    "event_description" text,
    "class_id"          integer            NOT NULL
);

CREATE TABLE "grades"
(
    "grade_id"    serial PRIMARY KEY NOT NULL,
    "student_id"  integer            NOT NULL,
    "teacher_id"  integer            NOT NULL,
    "subject_id"  integer            NOT NULL,
    "value"       numeric            NOT NULL,
    "weight"      numeric            NOT NULL,
    "inserted_at" date DEFAULT now(),
    "comment"     text
);

CREATE TABLE "homeworks"
(
    "homework_id" serial PRIMARY KEY NOT NULL,
    "class_id"    integer            NOT NULL,
    "subject_id"  integer            NOT NULL,
    "teacher_id"  integer,
    "title"       varchar(255)       NOT NULL,
    "description" text,
    "created_at"  date DEFAULT now(),
    "due_date"    date
);

CREATE TABLE "parent_students"
(
    "parent_id"  integer NOT NULL,
    "student_id" integer NOT NULL,
    CONSTRAINT "parent_students_parent_id_student_id_pk" PRIMARY KEY ("parent_id", "student_id")
);

CREATE TABLE "students"
(
    "student_id" serial PRIMARY KEY NOT NULL,
    "user_id"    integer            NOT NULL,
    "class_id"   integer,
    CONSTRAINT "students_user_id_unique" UNIQUE ("user_id")
);

CREATE TABLE "subjects"
(
    "subject_id"   serial PRIMARY KEY NOT NULL,
    "subject_name" varchar(255)       NOT NULL,
    "description"  text,
    CONSTRAINT "subjects_subject_name_unique" UNIQUE ("subject_name")
);

CREATE TABLE "teachers_classes"
(
    "teacher_id" integer NOT NULL,
    "class_id"   integer NOT NULL,
    CONSTRAINT "teachers_classes_teacher_id_class_id_pk" PRIMARY KEY ("teacher_id", "class_id")
);

CREATE TABLE "teachers"
(
    "teacher_id" serial PRIMARY KEY NOT NULL,
    "user_id"    integer            NOT NULL,
    CONSTRAINT "teachers_user_id_unique" UNIQUE ("user_id")
);

CREATE TABLE "teachers_subjects"
(
    "teacher_id" integer NOT NULL,
    "subject_id" integer NOT NULL,
    CONSTRAINT "teachers_subjects_teacher_id_subject_id_pk" PRIMARY KEY ("teacher_id", "subject_id")
);

CREATE TABLE "users"
(
    "user_id"         serial PRIMARY KEY NOT NULL,
    "name"            varchar(255)       NOT NULL,
    "surname"         varchar(255)       NOT NULL,
    "username"        varchar(255),
    "email"           varchar(255)       NOT NULL,
    "password"        varchar(255)       NOT NULL,
    "role"            varchar(50)        NOT NULL,
    "creation_date"   timestamp DEFAULT now(),
    "last_login_date" timestamp,
    CONSTRAINT "users_email_unique" UNIQUE ("email")
);

ALTER TABLE "classes"
    ADD CONSTRAINT "classes_coordinator_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("coordinator_teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "events"
    ADD CONSTRAINT "events_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students" ("student_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "events"
    ADD CONSTRAINT "events_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "events"
    ADD CONSTRAINT "events_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes" ("class_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "grades"
    ADD CONSTRAINT "grades_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students" ("student_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "grades"
    ADD CONSTRAINT "grades_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "grades"
    ADD CONSTRAINT "grades_subject_id_subjects_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects" ("subject_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "homeworks"
    ADD CONSTRAINT "homeworks_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes" ("class_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "homeworks"
    ADD CONSTRAINT "homeworks_subject_id_subjects_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects" ("subject_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "homeworks"
    ADD CONSTRAINT "homeworks_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "parent_students"
    ADD CONSTRAINT "parent_students_parent_id_users_user_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users" ("user_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "parent_students"
    ADD CONSTRAINT "parent_students_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students" ("student_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "students"
    ADD CONSTRAINT "students_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "students"
    ADD CONSTRAINT "students_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes" ("class_id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "teachers_classes"
    ADD CONSTRAINT "teachers_classes_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "teachers_classes"
    ADD CONSTRAINT "teachers_classes_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes" ("class_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "teachers"
    ADD CONSTRAINT "teachers_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "teachers_subjects"
    ADD CONSTRAINT "teachers_subjects_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers" ("teacher_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "teachers_subjects"
    ADD CONSTRAINT "teachers_subjects_subject_id_subjects_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects" ("subject_id") ON DELETE cascade ON UPDATE no action;

INSERT INTO "users" (user_id, name, surname, username, email, password, role)
VALUES (10001, 'Demo', 'Student', 'demostudent', 'student@demo.local',
        '$2a$12$VTS/Fgf/XZV1UgXSMgumgO2zT9fYhXoq4Qt4/rFQaa4dxHVDlDroC', 'student');
INSERT INTO "users" (user_id, name, surname, username, email, password, role)
VALUES (10002, 'Demo', 'Teacher', 'demoteacher', 'teacher@demo.local',
        '$2a$12$VTS/Fgf/XZV1UgXSMgumgO2zT9fYhXoq4Qt4/rFQaa4dxHVDlDroC', 'teacher');
INSERT INTO "users" (user_id, name, surname, username, email, password, role)
VALUES (10003, 'Demo', 'Parent', 'demoparent', 'parent@demo.local',
        '$2a$12$VTS/Fgf/XZV1UgXSMgumgO2zT9fYhXoq4Qt4/rFQaa4dxHVDlDroC', 'parent');
INSERT INTO "users" (user_id, name, surname, username, email, password, role)
VALUES (10004, 'Demo', 'Admin', 'demoadmin', 'admin@demo.local',
        '$2a$12$VTS/Fgf/XZV1UgXSMgumgO2zT9fYhXoq4Qt4/rFQaa4dxHVDlDroC', 'admin');
INSERT INTO "subjects" (subject_id, subject_name, description)
VALUES (10001, 'Maths', 'Maths subject');
INSERT INTO "subjects" (subject_id, subject_name, description)
VALUES (10002, 'History', 'History subject');

INSERT INTO "teachers" (teacher_id, user_id)
VALUES (10001, 10002);
INSERT INTO "teachers_subjects" (teacher_id, subject_id)
VALUES (10001, 10001);
INSERT INTO "teachers_subjects" (teacher_id, subject_id)
VALUES (10001, 10002);

INSERT INTO "classes" (class_id, class_name, school_year, coordinator_teacher_id)
VALUES (10001, '1^A', '2025', 10001);

INSERT INTO "teachers_classes" (teacher_id, class_id)
VALUES (10001, 10001);
INSERT INTO "students" (student_id, user_id, class_id)
VALUES (10001, 10001, 10001);
INSERT INTO "parent_students" (parent_id, student_id)
VALUES (10003, 10001);

INSERT INTO "grades" (grade_id, student_id, teacher_id, subject_id, "value", weight, comment, inserted_at)
VALUES (10001, 10001, 10001, 10001, '8', '100', 'Additions', TO_DATE('20/06/2025', 'DD/MM/YYYY'));
INSERT INTO "grades" (grade_id, student_id, teacher_id, subject_id, "value", weight, comment, inserted_at)
VALUES (10002, 10001, 10001, 10002, '9', '100', 'WW1', TO_DATE('16/06/2025', 'DD/MM/YYYY'));
INSERT INTO "grades" (grade_id, student_id, teacher_id, subject_id, "value", weight, comment, inserted_at)
VALUES (10003, 10001, 10001, 10002, '10', '100', 'WW2', TO_DATE('18/06/2025', 'DD/MM/YYYY'));

INSERT INTO "homeworks" (homework_id, class_id, subject_id, teacher_id, title, description, created_at, due_date)
VALUES (10001, 10001, 10001, 10001, 'Do 320 excercises', 'From page 320 to page 326',
        TO_DATE('20/06/2025', 'DD/MM/YYYY'), TO_DATE('26/06/2025', 'DD/MM/YYYY'));
INSERT INTO "homeworks" (homework_id, class_id, subject_id, teacher_id, title, description, created_at, due_date)
VALUES (10002, 10001, 10002, 10001, 'Study wars', 'Study WW1 and WW2', TO_DATE('20/06/2025', 'DD/MM/YYYY'),
        TO_DATE('26/06/2025', 'DD/MM/YYYY'))
