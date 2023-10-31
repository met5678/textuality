import SimpleSchema from 'simpl-schema';

const EventSchema = new SimpleSchema({
    name: String,
    phoneNumber: String,
    active: Boolean,
    theme: {
        type: String,
        allowedValues: [
            'clue', 'casino'
        ],
        defaultValue: 'casino'
    }
});

interface Event {
    _id: string;
    name: string;
    phoneNumber: string;
    active: boolean;
    theme: string;
}

export default EventSchema;
export { Event, EventSchema };
