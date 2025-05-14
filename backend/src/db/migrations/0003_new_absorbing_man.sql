CREATE TABLE "teachers_classes" (
	"teacher_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	CONSTRAINT "teachers_classes_teacher_id_class_id_pk" PRIMARY KEY("teacher_id","class_id")
);
--> statement-breakpoint
ALTER TABLE "teachers_classes" ADD CONSTRAINT "teachers_classes_teacher_id_teachers_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("teacher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers_classes" ADD CONSTRAINT "teachers_classes_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;