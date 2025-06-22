export enum EventType {
    ABSENCE = "absence",
    DELAY = "delay",
    LEAVE = "leave",
    PRESENT = "present"
}

export const getAbbreviation = (eventType: EventType) => {
    switch (eventType) {
        case "present":
            return "P"
        case "absence":
            return "A"
        case "delay":
            return "R"
        case "leave":
            return "U"
        default:
            return ""
    }
}

export const getColor = (eventType: EventType) => {
    switch (eventType) {
        case "present":
            return "bg-green-600"
        case "absence":
            return "bg-red-600"
        case "delay":
            return "bg-orange-600"
        case "leave":
            return "bg-yellow-600"
        default:
            return ""
    }
}

export const getDescription = (eventType: EventType) => {
    switch (eventType) {
        case "present":
            return "Present"
        case "absence":
            return "Absence"
        case "delay":
            return "Delay"
        case "leave":
            return "Leave"
        default:
            return ""
    }
}