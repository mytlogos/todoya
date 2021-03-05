import { Board, Category, Label, Project, Reminder, Task } from "./client";

export interface VuexStore {
    projects: Project[];
    boards: Board[];
    tasks: Task[];
    selectedProjects: number[];
    reminders: Record<number, Reminder[]>;
    categories: Category[];
    labels: Label[];
}