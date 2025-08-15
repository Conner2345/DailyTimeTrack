import { format, startOfDay, addDays, differenceInDays } from "date-fns";

export function formatTime(minutes: number): string {
  const isNegative = minutes < 0;
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  const sign = isNegative ? '-' : '+';
  return `${sign}${hours}:${mins.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = addDays(today, -1);
  
  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return `Today, ${format(date, 'MMM d')}`;
  } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return `Yesterday, ${format(date, 'MMM d')}`;
  } else {
    return format(date, 'MMM d');
  }
}

export function getDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseTimeInput(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

export function minutesToHoursAndMinutes(minutes: number): { hours: number; minutes: number } {
  const absMinutes = Math.abs(minutes);
  return {
    hours: Math.floor(absMinutes / 60),
    minutes: absMinutes % 60,
  };
}

export function shouldAddDailyTime(date: Date, activeDays: number[]): boolean {
  const dayOfWeek = date.getDay();
  return activeDays.includes(dayOfWeek);
}

export function getActiveDaysText(activeDays: number[]): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (activeDays.length === 0) return 'None';
  if (activeDays.length === 7) return 'Every day';
  
  // Check for common patterns
  if (activeDays.length === 5 && 
      activeDays.every(day => day >= 1 && day <= 5) &&
      activeDays.includes(1) && activeDays.includes(2) && 
      activeDays.includes(3) && activeDays.includes(4) && activeDays.includes(5)) {
    return 'Mon-Fri';
  }
  
  if (activeDays.length === 2 && activeDays.includes(0) && activeDays.includes(6)) {
    return 'Weekends';
  }
  
  // Default to listing days
  const sortedDays = [...activeDays].sort();
  return sortedDays.map(day => dayNames[day]).join(', ');
}
