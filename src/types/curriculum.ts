export interface CourseDetails {
  slNo: number;
  courseCode: string;
  courseTitle: string;
  courseType: string;
  version: string;
  L: number;
  T: number;
  P: number;
  J: number;
  credits: number;
}

export interface CurriculumCategory {
  slNo: number;
  category: string;
  credits: number;
  courses: CourseDetails[];
}