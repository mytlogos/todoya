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
    project?: number;
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
}

export interface Category extends Entity {
    title: string;
}

export const HttpClient = {

    getApiProjects(): Promise<Project[]> {
        return this.queryServer(api.api_projects_.get);
    },

    postApiProjects(value: Create<Project>): Promise<Project> {
        return this.queryServer(api.api_projects_.post, value);
    },

    deleteApiProjectsbyId(): Promise<unknown> {
        return this.queryServer(api["api_projects_{id}_"].delete);
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

    deleteApiBoardsbyId(): Promise<unknown> {
        return this.queryServer(api["api_boards_{id}_"].delete);
    },

    getApiBoardsbyId(): Promise<Board> {
        return this.queryServer(api["api_boards_{id}_"].get);
    },

    putApiBoardsbyId(value: Board): Promise<unknown> {
        return this.queryServer(api["api_boards_{id}_"].put, value);
    },

    getApiTasks(): Promise<Task[]> {
        return this.queryServer(api.api_tasks_.get).then(tasks => {
            // Force string Dates in task to Date object
            tasks.forEach((task: Task) => {
                task.start = task.start && new Date(task.start);
                task.due = task.due && new Date(task.due);
            });
            return tasks;
        });
    },

    postApiTasks(value: Create<Task>): Promise<Task> {
        return this.queryServer(api.api_tasks_.post, value);
    },

    deleteApiTasksbyId(): Promise<unknown> {
        return this.queryServer(api["api_tasks_{id}_"].delete);
    },

    getApiTasksbyId(): Promise<Task> {
        return this.queryServer(api["api_tasks_{id}_"].get);
    },

    putApiTasksbyId(value: Task): Promise<unknown> {
        return this.queryServer(api["api_tasks_{id}_"].put, value);
    },

    getApiCategories(): Promise<Category[]> {
        return this.queryServer(api.api_categories_.get);
    },

    postApiCategories(value: Create<Category>): Promise<Category> {
        return this.queryServer(api.api_categories_.post, value);
    },

    deleteApiCategoriesbyId(): Promise<unknown> {
        return this.queryServer(api["api_categories_{id}_"].delete);
    },

    getApiCategoriesbyId(): Promise<unknown> {
        return this.queryServer(api["api_categories_{id}_"].get);
    },

    putApiCategoriesbyId(value: Category): Promise<unknown> {
        return this.queryServer(api["api_categories_{id}_"].put, value);
    },

    async queryServer({ path, method }: { path: string; method?: string }, query?: any): Promise<any> {
        // if path includes user, it needs to be authenticated
        const init = {
            method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        };
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
        const result = await response.json();
        if (result.error) {
            return Promise.reject(result.error);
        }
        return result;
    },
};
