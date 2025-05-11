CREATE TABLE "classes" (
	"class_id" serial PRIMARY KEY NOT NULL,
	"class_name" varchar(255) NOT NULL,
	"school_year" varchar(50),
	"coordinator_teacher_id" integer,
	CONSTRAINT "classes_class_name_unique" UNIQUE("class_name")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"teacher_id" integer,
	"event_date" date NOT NULL,
	"event_hour" smallint NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_description" text
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"grade_id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"teacher_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"value" numeric NOT NULL,
	"weight" numeric NOT NULL,
	"inserted_at" date DEFAULT now(),
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "homeworks" (
	"homework_id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"teacher_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" date DEFAULT now(),
	"due_date" date
);
--> statement-breakpoint
CREATE TABLE "students" (
	"student_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date_of_birth" date,
	"class_id" integer,
	"registration_date" timestamp DEFAULT now(),
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"subjet_id" serial PRIMARY KEY NOT NULL,
	"subject_name" varchar(255) NOT NULL,
	"description" text,
	CONSTRAINT "subjects_subject_name_unique" UNIQUE("subject_name")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"teacher_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"landing_date" date,
	CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "teachers_subjects" (
	"teacher_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	CONSTRAINT "teachers_subjects_teacher_id_subject_id_pk" PRIMARY KEY("teacher_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"surname" varchar(255) NOT NULL,
	"username" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"creation_date" timestamp DEFAULT now(),
	"last_login_date" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_coordinator_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("coordinator_teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_subject_id_subjects_subjet_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subjet_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_subject_id_subjects_subjet_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subjet_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_subject_id_subjects_subjet_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subjet_id") ON DELETE cascade ON UPDATE no action;