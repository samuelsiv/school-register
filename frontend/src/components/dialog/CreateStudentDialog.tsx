import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {LockIcon, MailIcon, PlusIcon, Shield} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Class} from "@/types/class";
import { Button } from "../ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Turnstile} from "next-turnstile";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {fetcher, request} from "@/lib/request";
import {preload} from "swr";
import {NewUser, UserInfo} from "@/types/userInfo";
import {redirect} from "next/navigation";
import {useState} from "react";
import genPwd from "@/lib/passgen";
const createAccountSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(1),
    name: z.string().min(1),
    surname: z.string().min(1),
    role: z.enum(['student', 'teacher'])
});

export function CreateStudentDialog({classes, inserted}: {classes: Class[], inserted: (newUser: NewUser) => void}) {
    const defValues: NewUser = {
        email: "",
        password: genPwd(12),
        username: "",
        name: "",
        surname: "",
        role: "student"
    }
    const form = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: defValues
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    function onSubmit(values: NewUser) {
        setIsLoading(true);
        request("POST", "/api/v1/admin/create-account", {
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
                    inserted(values);
                }
            })
            .catch((err) => {
                console.log(err);
                form.setError("root", {message: "An error occurred while creating your account. Please try again."});
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    return <Dialog open={isOpen} onOpenChange={newOpen => setIsOpen(newOpen)}>
        <DialogTrigger className="p-2 bg-card border rounded-xl" ><PlusIcon /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="mb-4">Create a student</DialogTitle>

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
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"John"}
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
                            name="surname"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Surname</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"Doe"}
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
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"john_doe"}
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
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                                            {/*<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>*/}
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
                                                placeholder={"john_doe@gmail.com"} type={"email"}
                                                {...field}
                                            />
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

                {/*<Label>Classroom</Label>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Classroom" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map(classroom => <SelectItem value={classroom.classId.toString()}>{classroom.className}</SelectItem>)}
                    </SelectContent>
                </Select>*/}
            </DialogHeader>
        </DialogContent>
    </Dialog>
}