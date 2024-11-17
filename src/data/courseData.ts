import type { Course, TimeTable } from '../types';

export const courses: Course[] = [
  {
    code: 'CSE2003',
    title: 'Computer Architecture and Organization',
    credit: '4.0',
    classNo: 'BL2024250400563',
    slot: 'B14+F11+F12',
    faculty: 'JAY PRAKASH MAURYA - SCOPE',
    color: '#DBEAFE',
    meetLink: 'https://meet.google.com/waa-xgcx-ycc'
  },
  {
    code: 'CSE2004',
    title: 'Theory Of Computation And Compiler Design',
    credit: '4.0',
    classNo: 'BL2024250400585',
    slot: 'B11+B12+B13',
    faculty: 'AZRA NAZIR - SCOPE',
    color: '#DCFCE7',
    meetLink: 'https://meet.google.com/spw-jkbe-jxr'
  },
  {
    code: 'CSE3004',
    title: 'Design and Analysis of Algorithms',
    credit: '4.0',
    classNo: 'BL2024250400616',
    slot: 'C14+E11+E12',
    faculty: 'JASMINE SELVAKUMARI JEYA - SCOPE',
    color: '#FEE2E2',
    meetLink: 'https://meet.google.com/hue-tapu-psg'
  },
  {
    code: 'CSE3005',
    title: 'Software Engineering',
    credit: '4.0',
    classNo: 'BL2024250400622',
    slot: 'A21+A22+A23',
    faculty: 'A.V.R MAYURI - SCAI',
    color: '#F3E8FF',
    meetLink: 'https://meet.google.com/bts-ecrd-oau'
  },
  {
    code: 'ECE3004',
    title: 'Microprocessors And Microcontrollers',
    credit: '4.0',
    classNo: 'BL2024250400228',
    slot: 'A11+A12+A13',
    faculty: 'MAYANK GUPTA - SEEE',
    color: '#FEF3C7',
    meetLink: 'https://meet.google.com/ktz-txpy-hwt'
  },
  {
    code: 'HUM0001',
    title: 'Ethics And Values',
    credit: '2.0',
    classNo: 'BL2024250400555',
    slot: 'E21',
    faculty: 'RAJENDRA MAHANANDIA - VITBS',
    color: '#c5e7dc',
    meetLink: 'https://meet.google.com/frd-ouqx-pzp'
  },
  {
    code: 'CSE3012',
    title: 'Mobile Application Development',
    credit: '3.0',
    classNo: 'BL2024250400682',
    slot: 'B22+F21',
    faculty: 'G. GANESAN - SCOPE',
    color: '#FFF7ED',
    meetLink: 'https://meet.google.com/wme-tcsp-bfi'
  },
  {
    code: 'DSN2092',
    title: 'SUMMER INDUSTRIAL INTERNSHIP',
    credit: '1.0',
    classNo: 'BL2024250400858',
    slot: 'NIL',
    faculty: 'V. SIVASANKARAN - SEEE',
    color: '#dec9e9',
    meetLink: null
  }
];

export const timetable: TimeTable = {
  timeSlots: [
    '08:30 - 10:00',
    '10:05 - 11:35',
    '11:40 - 13:10',
    '13:15 - 14:45',
    '14:50 - 16:20',
    '16:25 - 17:55',
    '18:00 - 19:30'
  ],
  schedule: {
    'MON': ['A11','B11','C11','A21','A14','B21','C21'],
    'TUE': ['D11','E11','F11','D21','E14','E21','F21'],
    'WED': ['A12','B12','C12','A22','B14','B22','A24'],
    'THU': ['D12','E12','F12','D22','F14','E22','F22'],
    'FRI': ['A13','B13','C13','A23','C14','B23','B24']
  }
};
 
// Helper function to find course by slot
export function findCourseBySlot(slot: string): Course | undefined {
  return courses.find(course => {
    const courseSlots = course.slot.split('+');
    return courseSlots.includes(slot);
  });
}

// Helper function to get course color
export function getCourseColor(code: string): string {
  const course = courses.find(c => c.code === code);
  return course?.color || '#gray-100';
}
