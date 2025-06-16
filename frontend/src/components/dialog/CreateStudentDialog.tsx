import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {PlusIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Class} from "@/types/class";
import { Button } from "../ui/button";

export function CreateStudentDialog({classes}: {classes: Class[]}) {

    return <Dialog>
        <DialogTrigger className="p-2 bg-card border rounded-xl"><PlusIcon /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="mb-4">Create a student</DialogTitle>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder={"John"} className="mb-2" />

                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" placeholder={"Doe"} className="mb-2" />

                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder={"john_doe"} className="mb-2" />

                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder={"john_doe@gmail.com"} className="mb-2" />

                <Label>Classroom</Label>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Classroom" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map(classroom => <SelectItem value={classroom.classId.toString()}>{classroom.className}</SelectItem>)}
                    </SelectContent>
                </Select>
            </DialogHeader>
            <DialogFooter>
                <Button type="submit">Create</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}