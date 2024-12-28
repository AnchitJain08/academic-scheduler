import type { Course, TimeTable } from '../types';

export const courses: Course[] = [
  {
    code: 'CSE0002',
    title: 'OPEN SOURCE SOFTWARE (LINUX ADMINISTRATION)',
    credit: '2.0',
    classNo: 'BL2024250501067',
    slot: 'E21',
    faculty: 'KANNAN - SCOPE',
    color: '#DBEAFE',
    meetLink: null
  },
  {
    code: 'CSE3003',
    title: 'Operating System',
    credit: '4.0',
    classNo: 'BL2024250500624',
    slot: 'B11+B12+B13',
    faculty: 'PUSHPINDER SINGH PATHEJA - SCOPE',
    color: '#DCFCE7',
    meetLink: null
  },
  {
    code: 'CSE3006',
    title: 'Computer Networks',
    credit: '4.0',
    classNo: 'BL2024250501079',
    slot: 'C14+E11+E12',
    faculty: 'TRAPTI SHARMA - SCAI',
    color: '#FEE2E2',
    meetLink: null
  },
  {
    code: 'CSE3009',
    title: 'Parallel and Distributed Computing',
    credit: '4.0',
    classNo: 'BL2024250500685',
    slot: 'A11+A12+A13',
    faculty: 'E. NIRMALA - SCOPE',
    color: '#FEF3C7',
    meetLink: null
  },
  {
    code: 'CSE3015',
    title: 'AWS Cloud Practitioner',
    credit: '4.0',
    classNo: 'BL2024250500705',
    slot: 'B14+F11+F12',
    faculty: 'RAVI VERMA - SCOPE',
    color: '#F3E8FF',
    meetLink: null
  },
  {
    code: 'HUM0003',
    title: 'INDIAN CONSTITUTION',
    credit: '2.0',
    classNo: 'BL2024250501104',
    slot: 'F14',
    faculty: 'KANNAN - SCOPE',
    color: '#c5e7dc',
    meetLink: null
  },
  {
    code: 'MAT2003',
    title: 'Applied Numerical Method',
    credit: '3.0',
    classNo: 'BL2024250500302',
    slot: 'C11+C13',
    faculty: 'AJAY KUMAR BHURJEE - SASL',
    color: '#FFF7ED',
    meetLink: null
  },
  {
    code: 'PLA1006',
    title: 'Lateral Thinking',
    credit: '2.0',
    classNo: 'BL2024250500864',
    slot: 'D11',
    faculty: 'ETHNUS TARINER 500001 - ACAD',
    color: '#dec9e9',
    meetLink: null
  },
  {
    code: null,
    title: 'NPTEL Elective - Marketing Analytics',
    credit: '3.0',
    classNo: null,
    slot: null,
    faculty: 'Swagato Chatterjee (IIT Kharagpur)',
    color: '#F472B6',
    meetLink: 'https://onlinecourses.nptel.ac.in/noc25_mg45/preview'
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
    const courseSlots = course.slot?.split('+');
    return courseSlots?.includes(slot);
  });
}

// Helper function to get course color
export function getCourseColor(code: string): string {
  const course = courses.find(c => c.code === code);
  return course?.color || '#gray-100';
}
