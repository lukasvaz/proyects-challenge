// interfaces 
interface ProjectAttributes {
  id: number;
  name: string;
  client: string;
  initDate: Date | null;
  endDate: Date | null;
}

interface WorkerAttributes {
  id: number;
  name: string;
  role: string;
  seniority: Seniority;
  projectId?: number | null;
}
type Seniority = "junior" | "semi-senior" | "senior";
