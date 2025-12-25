export interface TimeSelectorProps {
  startHour?: number;
  endHour?: number;
  interval?: number; // Intervalle en minutes (par défaut 30)
  title?: string;
  selectedTime?: string;
  onTimeSelected?: (time: string) => void;
}
