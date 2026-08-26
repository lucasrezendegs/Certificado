import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, StudentData } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      directorName: 'Carlos Henrique Ferreira De Mello',
      directorSignature: null,
      leftBadge: null,
      rightBadge: null,
      controlNumbers: ['001/CVTE/2026', '006/CVTE/2026'],
      courses: ['Condutores de Veículos de Transporte de Emergência', 'Formação de Cabos', 'Direção Defensiva Avançada'],
      categories: ['AD', 'B', 'C', 'D', 'E'],
      workloads: ['50h/a', '40h/a', '60h/a', '80h/a'],
      students: [],

      setDirectorName: (name) => set({ directorName: name }),
      setDirectorSignature: (signature) => set({ directorSignature: signature }),
      setLeftBadge: (badge) => set({ leftBadge: badge }),
      setRightBadge: (badge) => set({ rightBadge: badge }),
      
      addControlNumber: (controlNumber) => set((state) => ({ 
        controlNumbers: state.controlNumbers.includes(controlNumber) ? state.controlNumbers : [...state.controlNumbers, controlNumber] 
      })),

      addCourse: (course) => set((state) => ({ 
        courses: state.courses.includes(course) ? state.courses : [...state.courses, course] 
      })),
      
      addCategory: (category) => set((state) => ({ 
        categories: state.categories.includes(category) ? state.categories : [...state.categories, category] 
      })),
      
      addWorkload: (workload) => set((state) => ({ 
        workloads: state.workloads.includes(workload) ? state.workloads : [...state.workloads, workload] 
      })),

      setStudents: (students) => set({ students }),
      
      addStudent: (student) => set((state) => ({ 
        students: [...state.students, student] 
      })),
      
      removeStudent: (id) => set((state) => ({ 
        students: state.students.filter(s => s.id !== id) 
      })),
      
      clearStudents: () => set({ students: [] }),
    }),
    {
      name: 'certificado-storage-badmqgex',
    }
  )
);
