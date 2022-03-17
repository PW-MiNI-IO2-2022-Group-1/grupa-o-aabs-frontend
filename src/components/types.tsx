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
    beginning: Date,
    end: Date,
}