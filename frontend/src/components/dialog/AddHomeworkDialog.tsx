import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {PlusIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import { Button } from "../ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {request} from "@/lib/request";
import {ExtendedUserInfo} from "@/types/userInfo";
import {useState} from "react";
import {Subject} from "@/types/subject";
const createHomeworkSchema = z.object({
    description: z.string(),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
    title: z.string(),
    teacherId: z.number(),
    subjectId: z.number(),
});

export function AddHomeworkDialog({subjects, teacherId, classId, onCreate}: {subjects: Subject[], teacherId: number, classId: number, onCreate: () => void}) {
    const defValues = {
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        title: "",
        teacherId: teacherId,
        subjectId: subjects[0].subjectId!,
    }
    const form = useForm({
        resolver: zodResolver(createHomeworkSchema),
        defaultValues: defValues
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    function onSubmit(values: object) {
        setIsLoading(true);
        request("PUT", `/api/v1/teachers/classes/${classId}/homeworks`, {
            data: values
        })
            .then((data) => {
                if (data.error) {
                    const errorMessage: string = data.error;

                    form.setError("root", {message: errorMessage});
                    return;
                } else {
                    console.log(values);
                    setIsOpen(false);
                    onCreate()
                }
            })
            .catch((err) => {
                console.log(err);
                form.setError("root", {message: "An error occurred while creating your homework. Please try again."});
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    return <Dialog open={isOpen} onOpenChange={newOpen => setIsOpen(newOpen)}>
        <DialogTrigger className="p-2 bg-card border rounded-xl" ><PlusIcon /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="mb-4">Create an homework</DialogTitle>

                <Form {...form}>
                    {form.formState.errors.root && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>
                                {form.formState.errors.root.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Homework title</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"Study for tomorrow's history test"}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Homework description</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"blah blah blah"}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subjectId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            <Select onValueChange={(value) => field.onChange(parseInt(value))}
                                                    defaultValue={field.value.toString()}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map(subject => <SelectItem value={subject.subjectId.toString()} key={"sub-" + subject.subjectId.toString()}>{subject.subjectName}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </form>
                </Form>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}