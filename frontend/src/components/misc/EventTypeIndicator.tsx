import {EventType, getAbbreviation, getColor} from "@/types/eventType";

export default function EventTypeIndicator({type, setType, isGray, className}: {
  type: EventType, setType: (type: EventType) => void, isGray: boolean, className?: string
}) {
  return <div
    className={`flex font-bold border-e-1 text-4xl rounded-xl select-none
                             align-center items-center justify-center aspect-square ${!isGray ? getColor(type) : "bg-gray-600"} ${className || ""}`}
    onClick={() => setType(type)}
  >
    {getAbbreviation(type)}
  </div>
}