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

export function NewUserDialog({user}: {user: NewUser}) {
    const [isOpen, setIsOpen] = useState(true);

    return <Dialog open={isOpen} onOpenChange={newOpen => setIsOpen(newOpen)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="mb-4">User created!</DialogTitle>
                <DialogDescription>You just created a new user of role {user?.role}</DialogDescription>
                <DialogTitle className="mb-4 font-black">Username: {user?.username}</DialogTitle>
                <DialogTitle className="mb-4 font-black">Email: {user?.email}</DialogTitle>
                <DialogTitle className="mb-4 font-black">Password: {user?.password}</DialogTitle>

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