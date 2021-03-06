import { Condition, Actions } from "./actions";

/**
 * Allowed Methods for the API.
 */
const Methods: { post: string; get: string; put: string; delete: string } = {
    post: "POST",
    get: "GET",
    put: "PUT",
    delete: "DELETE",
};

const api = {
    "api_projects_": {
        get: {
            method: Methods.get,
            path: "api/projects/"
        },
        post: {
            method: Methods.post,
            path: "api/projects/"
        },
    },
    "api_projects_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/projects/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/projects/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/projects/{id}/"
        },
    },
    "api_boards_": {
        get: {
            method: Methods.get,
            path: "api/boards/"
        },
        post: {
            method: Methods.post,
            path: "api/boards/"
        },
    },
    "api_boards_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/boards/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/boards/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/boards/{id}/"
        },
    },
    "api_tasks_": {
        get: {
            method: Methods.get,
            path: "api/tasks/"
        },
        post: {
            method: Methods.post,
            path: "api/tasks/"
        },
    },
    "api_tasks_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/tasks/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/tasks/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/tasks/{id}/"
        },
    },
    "api_reminders_": {
        get: {
            method: Methods.get,
            path: "api/reminders/"
        },
        post: {
            method: Methods.post,
            path: "api/reminders/"
        },
    },
    "api_reminders_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/reminders/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/reminders/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/reminders/{id}/"
        },
    },
    "api_categories_": {
        get: {
            method: Methods.get,
            path: "api/categories/"
        },
        post: {
            method: Methods.post,
            path: "api/categories/"
        },
    },
    "api_categories_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/categories/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/categories/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/categories/{id}/"
        },
    },
    "api_labels_": {
        get: {
            method: Methods.get,
            path: "api/labels/"
        },
        post: {
            method: Methods.post,
            path: "api/labels/"
        },
    },
    "api_labels_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/labels/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/labels/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/labels/{id}/"
        },
    },
    "api_priorityLists_": {
        get: {
            method: Methods.get,
            path: "api/priorityLists/"
        },
        post: {
            method: Methods.post,
            path: "api/priorityLists/"
        },
    },
    "api_checkLists_": {
        get: {
            method: Methods.get,
            path: "api/checkLists/"
        },
        post: {
            method: Methods.post,
            path: "api/checkLists/"
        },
    },
    "api_checkLists_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/checkLists/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/checkLists/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/checkLists/{id}/"
        },
    },
    "api_checkItems_": {
        get: {
            method: Methods.get,
            path: "api/checkItems/"
        },
        post: {
            method: Methods.post,
            path: "api/checkItems/"
        },
    },
    "api_checkItems_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/checkItems/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/checkItems/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/checkItems/{id}/"
        },
    },
    "api_actions_": {
        get: {
            method: Methods.get,
            path: "api/actions/"
        },
        post: {
            method: Methods.post,
            path: "api/actions/"
        },
    },
    "api_actions_{id}_": {
        delete: {
            method: Methods.delete,
            path: "api/actions/{id}/"
        },
        get: {
            method: Methods.get,
            path: "api/actions/{id}/"
        },
        put: {
            method: Methods.put,
            path: "api/actions/{id}/"
        },
    },
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Create<T extends Entity> = PartialBy<T, keyof Entity>;

export interface Entity {
    id: number;
}

export interface Project extends Entity {
    title: string;
    parent?: number;
}

export interface Board extends Entity {
    title: string;
    position: number;
    project?: number;
    sort_by: keyof Task;
}

export interface Label extends Entity {
    title: string;
    color: string;
}

export interface Reminder extends Entity {
    task: number
    when: Date
}

export interface CheckList extends Entity {
    task: number;
    title: string;
    items: CheckItem[];
}

export interface CheckItem extends Entity {
    title: string;
    checked: boolean;
    list: number;
}

export interface Task extends Entity {
    title: string;
    start?: Date | string;
    due?: Date | string;
    completion_date?: Date | string;
    location?: string;
    description: string;
    board?: number;
    project: number;
    parent_task?: Task | null;
    categories: number[];
    labels: number[];
    priority: number;
}

export interface Priority extends Entity {
    title: string;
    value: number;
}

export interface PriorityList extends Entity {
    title: string;
    items: Priority[];
    project: number;
    default: number;
}

export interface Action extends Entity {
    condition: Condition;
    action: keyof typeof Actions;
    board: number;
}

export interface Category extends Entity {
    title: string;
}
export function reyhydrateDate<T extends Record<string, any>, K extends T[]>(values: K, ...keys: Array<keyof T>): T[];
export function reyhydrateDate<T extends Record<string, any>, K extends T>(values: K, ...keys: Array<keyof T>): T;
export function reyhydrateDate<T extends Record<string, any>, K = T | T[]>(values: K, ...keys: Array<keyof T>): K {
    if (Array.isArray(values)) {
        values.forEach(value => {
            for (const key of keys) {
                value[key] = value[key] && new Date(value[key]);
            }
        });
    } else {
        for (const key of keys) {
            // @ts-expect-error
            values[key] = values[key] && new Date(values[key]);
        }
    }
    return values;
}

export const HttpClient = {

    getApiProjects(): Promise<Project[]> {
        return this.queryServer(api.api_projects_.get);
    },

    postApiProjects(value: Create<Project>): Promise<Project> {
        return this.queryServer(api.api_projects_.post, value);
    },

    deleteApiProjectsbyId(id: number): Promise<void> {
        return this.queryServer(api["api_projects_{id}_"].delete, { id });
    },

    getApiProjectsbyId(id: number): Promise<Project> {
        return this.queryServer(api["api_projects_{id}_"].get);
    },

    putApiProjectsbyId(value: Project): Promise<unknown> {
        return this.queryServer(api["api_projects_{id}_"].put, value);
    },

    getApiBoards(): Promise<Board[]> {
        return this.queryServer(api.api_boards_.get);
    },

    postApiBoards(value: Create<Board>): Promise<Board> {
        return this.queryServer(api.api_boards_.post, value);
    },

    deleteApiBoardsbyId(): Promise<void> {
        return this.queryServer(api["api_boards_{id}_"].delete);
    },

    getApiBoardsbyId(): Promise<Board> {
        return this.queryServer(api["api_boards_{id}_"].get);
    },

    putApiBoardsbyId(value: Board): Promise<unknown> {
        return this.queryServer(api["api_boards_{id}_"].put, value);
    },

    getApiTasks(): Promise<Task[]> {
        // Force string Dates in task to Date object
        return this
            .queryServer(api.api_tasks_.get)
            .then((tasks: Task[]) => reyhydrateDate(tasks, "start", "due", "completion_date"));
    },

    postApiTasks(value: Create<Task>): Promise<Task> {
        return this
            .queryServer(api.api_tasks_.post, value)
            .then((tasks: Task) => reyhydrateDate(tasks, "start", "due", "completion_date") as Task);
    },

    deleteApiTasksbyId(id: number): Promise<void> {
        return this.queryServer(api["api_tasks_{id}_"].delete, { id });
    },

    getApiTasksbyId(): Promise<Task> {
        return this.queryServer(api["api_tasks_{id}_"].get);
    },

    putApiTasksbyId(value: Task): Promise<unknown> {
        return this.queryServer(api["api_tasks_{id}_"].put, value);
    },

    getApiReminders(): Promise<Reminder[]> {
        // Force string Dates in reminder to Date object
        return this
            .queryServer(api.api_reminders_.get)
            .then((reminders: Reminder[]) => reyhydrateDate(reminders, "when"));
    },

    postApiReminders(value: Create<Reminder>): Promise<Reminder> {
        return this
            .queryServer(api.api_reminders_.post, value)
            .then((reminders: Reminder) => reyhydrateDate(reminders, "when") as Reminder);
    },

    deleteApiRemindersbyId(id: number): Promise<void> {
        return this.queryServer(api["api_reminders_{id}_"].delete, { id });
    },

    getApiRemindersbyId(id: number): Promise<Reminder> {
        return this.queryServer(api["api_reminders_{id}_"].get, { id });
    },

    putApiRemindersbyId(value: Reminder): Promise<unknown> {
        return this.queryServer(api["api_reminders_{id}_"].put, value);
    },

    getApiCategories(): Promise<Category[]> {
        return this.queryServer(api.api_categories_.get);
    },

    postApiCategories(value: Create<Category>): Promise<Category> {
        return this.queryServer(api.api_categories_.post, value);
    },

    deleteApiCategoriesbyId(): Promise<void> {
        return this.queryServer(api["api_categories_{id}_"].delete);
    },

    getApiCategoriesbyId(): Promise<unknown> {
        return this.queryServer(api["api_categories_{id}_"].get);
    },

    putApiCategoriesbyId(value: Category): Promise<unknown> {
        return this.queryServer(api["api_categories_{id}_"].put, value);
    },

    getApiLabels(): Promise<Label[]> {
        return this.queryServer(api.api_labels_.get);
    },

    postApiLabels(value: Create<Label>): Promise<Label> {
        return this.queryServer(api.api_labels_.post, value);
    },

    deleteApiLabelsbyId(): Promise<void> {
        return this.queryServer(api["api_labels_{id}_"].delete);
    },

    getApiLabelsbyId(id: number): Promise<Label> {
        return this.queryServer(api["api_labels_{id}_"].get, { id });
    },

    putApiLabelsbyId(value: Label): Promise<unknown> {
        return this.queryServer(api["api_labels_{id}_"].put, value);
    },

    getApiActions(): Promise<Action[]> {
        return this.queryServer(api.api_actions_.get);
    },

    postApiActions(value: Create<Action>): Promise<Action> {
        return this.queryServer(api.api_actions_.post, value);
    },

    deleteApiActionsbyId(id: number): Promise<void> {
        return this.queryServer(api["api_actions_{id}_"].delete, { id });
    },

    getApiActionsbyId(id: number): Promise<Action> {
        return this.queryServer(api["api_actions_{id}_"].get, { id });
    },

    putApiActionsbyId(value: Action): Promise<Action> {
        return this.queryServer(api["api_actions_{id}_"].put, value);
    },

    getApiCheckItems(): Promise<CheckItem[]> {
        return this.queryServer(api.api_checkItems_.get);
    },

    postApiCheckItems(value: Create<CheckItem>): Promise<CheckItem> {
        return this.queryServer(api.api_checkItems_.post, value);
    },

    deleteApiCheckItemsbyId(id: number): Promise<void> {
        return this.queryServer(api["api_checkItems_{id}_"].delete, { id });
    },

    getApiCheckItemsbyId(id: number): Promise<CheckItem> {
        return this.queryServer(api["api_checkItems_{id}_"].get, { id });
    },

    putApiCheckItemsbyId(value: CheckItem): Promise<CheckItem> {
        return this.queryServer(api["api_checkItems_{id}_"].put, value);
    },

    getApiPriorityLists(): Promise<PriorityList[]> {
        return this.queryServer(api.api_priorityLists_.get);
    },

    postApiPriorityLists(value: Create<PriorityList>): Promise<PriorityList> {
        return this.queryServer(api.api_priorityLists_.post, value);
    },

    getApiCheckLists(): Promise<CheckList[]> {
        return this.queryServer(api.api_checkLists_.get);
    },

    postApiCheckLists(value: Create<CheckList>): Promise<CheckList> {
        return this.queryServer(api.api_checkLists_.post, value);
    },

    deleteApiCheckListsbyId(id: number): Promise<void> {
        return this.queryServer(api["api_checkLists_{id}_"].delete, { id });
    },

    getApiCheckListsbyId(id: number): Promise<CheckList> {
        return this.queryServer(api["api_checkLists_{id}_"].get, { id });
    },

    putApiCheckListsbyId(value: CheckList): Promise<CheckItem> {
        return this.queryServer(api["api_checkLists_{id}_"].put, value);
    },

    async queryServer({ path, method }: { path: string; method?: string }, query?: any): Promise<any> {
        // if path includes user, it needs to be authenticated
        const init = {
            method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        };
        // template entity id if available
        const idIndex = path.indexOf("/{id}/");

        if (idIndex >= 0) {
            if (!query || !Number.isInteger(query.id)) {
                throw Error(`No Entity Id available in Query: '${query}'`)
            }
            path = path.replace("/{id}/", `/${query.id}/`);
        }
        const url = new URL(`${window.location.origin}/${path}`);
        if (query) {
            if (method === Methods.get) {
                Object.keys(query).forEach((key) =>
                    url.searchParams.append(key, query[key]),
                );
            } else {
                // @ts-expect-error
                init.body = JSON.stringify(query);
            }
        }
        const response = await fetch(url.toString(), init);
        const text = await response.text();
        // some HTTP Requests (like Delete) may not return any content
        const result = text ? JSON.parse(text) : undefined;

        if (result && result.error) {
            return Promise.reject(result.error);
        }
        return result;
    },
};
