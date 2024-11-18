import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Schedule {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  schedules: Schedule[];
}

interface StoreState {
  courses: Course[];
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  updateCourse: (courseId: string, updatedCourse: Course) => void;
  clearCourses: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      courses: [],
      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, course],
        })),
      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== courseId),
        })),
      updateCourse: (courseId, updatedCourse) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId ? updatedCourse : course
          ),
        })),
      clearCourses: () => set({ courses: [] }),
    }),
    {
      name: 'acadflow-storage',
    }
  )
);
