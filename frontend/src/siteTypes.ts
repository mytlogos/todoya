import { Board, Project, Task } from "./client";

export interface VuexStore {
    projects: Project[];
    boards: Board[];
    tasks: Task[];
    selectedProjects: number[];
}