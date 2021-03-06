import { Action, Board, Category, CheckList, Label, PriorityList, Project, Reminder, Task } from "./client";

export interface ConfirmationModal {
    title: string;
    onConfirm: () => void;
    onChoice: () => void;
}

export interface AddTaskModal {
    onConfirm?: () => void;
    onChoice?: () => void;
    project?: number;
    board?: number;
}

export interface VuexStore {
    projects: Project[];
    boards: Board[];
    tasks: Task[];
    selectedProjects: number[];
    reminders: Record<number, Reminder[]>;
    categories: Category[];
    labels: Label[];
    reminderNotifications: Record<number, { id: number; timeoutId: number, finished: boolean }>;
    notificationsSettings: { requested: boolean };
    editTask: null | number;
    confirmationModal: null | ConfirmationModal;
    addTaskModal: null | AddTaskModal | boolean;
    editProjectModal: null | number;
    checkLists: Record<number, CheckList[]>;
    priorityLists: Record<number, PriorityList>;
    actions: Record<number, Action[]>;
}