import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {NewUser} from "@/types/userInfo";
import {useState} from "react";
import {SchoolEvent} from "@/types/event";
import {EventType, getAbbreviation, getColor} from "@/types/eventType";
import {TableCell} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {CopyIcon, PlusIcon, TextIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export function EditHoursEventsDialog({onDimiss, onSave}: {onDimiss: () => void, onSave: (description: string) => void}) {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedDescription, setEventDescription] = useState("");

    return <Dialog open={isOpen} onOpenChange={newOpen => {
        setIsOpen(newOpen)
        if (!newOpen) {
            onDimiss()
        }
    }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="mb-2">Edit hour description</DialogTitle>
                <div
                    className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                    <span className="px-3 text-muted-foreground">
                        <TextIcon size={16}/>
                    </span>
                    <Textarea
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder={"did this and that..."}
                        value={selectedDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                </div>
            </DialogHeader>
            <DialogFooter>
                <Button type="submit" onClick={() => {
                    onSave(selectedDescription)
                    onDimiss()
                }}>Edit</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}