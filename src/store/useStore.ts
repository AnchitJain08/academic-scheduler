import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  registrationNumber: string;
}

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
  auth: AuthState;
  student: Student | null;
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  updateCourse: (courseId: string, updatedCourse: Course) => void;
  clearCourses: () => void;
  login: (registrationNumber: string, password: string) => Promise<void>;
  signup: (userData: Omit<Student, 'id' | 'program'> & { password: string }) => Promise<void>;
  setAuth: (state: Partial<AuthState>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      courses: [],
      auth: {
        isAuthenticated: false,
        isLoading: false,
      },
      student: null,
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
      login: async (registrationNumber, password) => {
        set((state) => ({ auth: { ...state.auth, isLoading: true, error: undefined } }));
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({
            auth: { isAuthenticated: true, isLoading: false },
            student: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              program: 'Computer Science',
              registrationNumber
            }
          });
        } catch (error) {
          set((state) => ({
            auth: {
              ...state.auth,
              isLoading: false,
              error: 'Invalid credentials'
            }
          }));
        }
      },
      signup: async (userData) => {
        set((state) => ({ auth: { ...state.auth, isLoading: true, error: undefined } }));
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({
            auth: { isAuthenticated: true, isLoading: false },
            student: {
              id: '1',
              name: userData.name,
              email: userData.email,
              program: 'Computer Science',
              registrationNumber: userData.registrationNumber
            }
          });
        } catch (error) {
          set((state) => ({
            auth: {
              ...state.auth,
              isLoading: false,
              error: 'Registration failed'
            }
          }));
        }
      },
      setAuth: (state) => set((prev) => ({ auth: { ...prev.auth, ...state } })),
    }),
    {
      name: 'acadflow-storage',
    }
  )
);
