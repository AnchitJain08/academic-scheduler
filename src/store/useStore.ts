import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types';

interface State {
  student: Student | null;
  setStudent: (student: Student) => void;
  clearStudent: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      student: null,
      setStudent: (student) => set({ student }),
      clearStudent: () => set({ student: null }),
    }),
    {
      name: 'academic-scheduler-storage',
    }
  )
);
