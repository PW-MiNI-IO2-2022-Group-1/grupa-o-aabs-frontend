export type DoctorScheduleForm = {
    week: Date,
    monSlots: TimeSlot[],
    tueSlots: TimeSlot[],
    wedSlots: TimeSlot[],
    thuSlots: TimeSlot[],
    friSlots: TimeSlot[],
    satSlots: TimeSlot[],
    sunSlots: TimeSlot[]
};
export type TimeSlot = {
    beginning: {
        hour: string;
        minute: string;
    },
    end: {
        hour: string;
        minute: string;
    },
}
export type Visit = {
    date: Date;
    isOccupied: boolean;
}