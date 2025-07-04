import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useState} from "react";
import {SchoolEvent} from "@/types/event";
import {EventType, getAbbreviation, getColor} from "@/types/eventType";
import {TextIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export function ModifyEventDialog({event, onDimiss, onSave}: {
  event: SchoolEvent,
  onDimiss: () => void,
  onSave: (type: EventType, description: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedType, setEventType] = useState(event.eventType);
  const [selectedDescription, setEventDescription] = useState(event.eventDescription);

  return <Dialog open={isOpen} onOpenChange={newOpen => {
    setIsOpen(newOpen)
    if (!newOpen) {
      onDimiss()
    }
  }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-2">Modify event</DialogTitle>
        <DialogDescription className="mb-2">Event type</DialogDescription>
        <div className={"flex flex-row gap-4 w-full justify-center items-center"}>
          {Object.keys(EventType).map(type =>
            <div
              className={`flex font-bold border-e-1 w-1/5 text-4xl rounded-2xl select-none
                             align-center items-center justify-center aspect-square ${selectedType == EventType[type as keyof typeof EventType] ? getColor(EventType[type as keyof typeof EventType]) : "bg-gray-600"}`}
              key={`event-${event.eventId}-type-${type}`}
              onClick={() => setEventType(EventType[type as keyof typeof EventType])}
            >
              {getAbbreviation(EventType[type as keyof typeof EventType])}
            </div>
          )}
        </div>
        <DialogDescription className="mb-2">Event description</DialogDescription>
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
          onSave(selectedType, selectedDescription)
          onDimiss()
        }}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}