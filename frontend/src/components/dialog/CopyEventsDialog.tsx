import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useState} from "react";
import {TextIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export function CopyEventsDialog({onDimiss, onSave}: { onDimiss: () => void, onSave: (description: string) => void }) {
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
        <DialogTitle className="mb-2">New hour</DialogTitle>
        <DialogDescription className="mb-2">Events description</DialogDescription>
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
        }}>Copy</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}