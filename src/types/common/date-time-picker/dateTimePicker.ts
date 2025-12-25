// Types for the DateTimePicker component

export interface TimeSlot {
  start: string;
  end: string;
  agent_ids: number[];
}

export interface DateAvailability {
  date: string;
  hours: TimeSlot[];
}

export interface DateTimePickerProps {
  className?: string;
  onDateTimeSelect?: (date: string, timeSlot: TimeSlot) => void;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  availabilityData?: DateAvailability[];
  disabled?: boolean;
}

export interface DateTimeSelection {
  date: string;
  timeSlot: TimeSlot;
}
