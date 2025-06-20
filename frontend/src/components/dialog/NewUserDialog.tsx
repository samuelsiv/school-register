import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {NewUser} from "@/types/userInfo";
import {useState} from "react";

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