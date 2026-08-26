export interface StudentData {
  id: string;
  controlNumber: string; // Número de Controle/Ano
  name: string;
  cpf: string;
  registry: string; // Nº de Registro
  category: string;
  course: string;
  periodStart: string; // Data Início (YYYY-MM-DD)
  periodEnd: string; // Data Término (YYYY-MM-DD)
  period?: string; // Texto legado como fallback
  workload: string;
  issueDate: string; // Data de Emissão (YYYY-MM-DD)
}

export interface AppState {
  directorName: string;
  directorSignature: string | null;
  leftBadge: string | null;
  rightBadge: string | null;
  controlNumbers: string[];
  courses: string[];
  categories: string[];
  workloads: string[];
  students: StudentData[];
  
  setDirectorName: (name: string) => void;
  setDirectorSignature: (signature: string | null) => void;
  setLeftBadge: (badge: string | null) => void;
  setRightBadge: (badge: string | null) => void;
  addControlNumber: (controlNumber: string) => void;
  addCourse: (course: string) => void;
  addCategory: (category: string) => void;
  addWorkload: (workload: string) => void;
  setStudents: (students: StudentData[]) => void;
  addStudent: (student: StudentData) => void;
  removeStudent: (id: string) => void;
  clearStudents: () => void;
}
