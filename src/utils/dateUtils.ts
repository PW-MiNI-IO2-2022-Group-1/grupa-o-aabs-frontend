export function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}

export function addDays(date: Date, days: number) {
    return new Date(date.getTime() + days * 86400000);
}

export function getBeginningOfWeek(date: Date) {
    if(date.getDay() === 0)
        return addDays(date, -6);
    return addDays(date, -date.getDay() + 1);
}