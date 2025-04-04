export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  semester: number;
}

export interface Course {
  code: string | null;
  title: string;
  credit: string;
  classNo: string;
  roomNo: string;
  slot: string;
  faculty: string;
  color: string;
  meetLink: string | null;
  totalClasses?: number;
  maxAbsent?: number;
}

export interface TimeSlot {
  time: string;
  slots: {
    [day: string]: string;
  };
}

export interface TimeTable {
  timeSlots: string[];
  schedule: {
    [day: string]: string[];
  };
}

export interface AcademicEvent {
  id: string;
  title: string;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  type: 'holiday' | 'exam' | 'deadline' | 'other';
  description: string;
}
