import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EventType} from "@/types/EventType";

export function EventsCard({events}: {events: {id: number, type: EventType, date: string}[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                    Events to justify
                </CardDescription>
            </CardHeader>
            <CardContent>
                {events.map((event) => <Card key={event.id}>
                    <CardContent>
                        <h3 className="font-bold">{event.type}, {event.date}</h3>
                    </CardContent>
                    <CardAction className="w-full">
                        <Button variant="default">Justify</Button>
                    </CardAction>
                </Card>)}

            </CardContent>
        </Card>
    )
}