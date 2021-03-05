import { Board, Category, Create, Entity, HttpClient, Label, Project, Reminder, reyhydrateDate, Task } from "@/client";
import { VuexStore } from "@/siteTypes";
import { createLogger, createStore } from "vuex";
import persistedState from "vuex-persistedstate";

function remove<T>(list: T[], value: T) {
  const index = list.indexOf(value);
  if (index >= 0) {
    list.splice(index, 1);
  }
}

function nextId<T extends Entity>(entities: T[]): number {
  let maxId = 0;
  entities.forEach(value => value.id > maxId ? maxId = value.id : undefined);
  return maxId + 1;
}

async function sync<T extends Entity>(online: Promise<Array<T>>, current: T[], create: (value: T) => Promise<any>): Promise<T[]> {
  const onlineValues = await online;
  const ids = new Set(onlineValues.map(value => value.id));

  // add all new values separately
  await Promise.all(
    current
      .filter(value => !ids.has(value.id))
      .map(value => create(value).then(created => onlineValues.push(created)))
  );

  return onlineValues;
}

export default createStore({
  plugins: [
    createLogger(),
    persistedState({
      rehydrated: store => {
        // rehydrate dates
        // @ts-expect-error
        reyhydrateDate(store.state.tasks, "start", "due", "completion_date");
        // @ts-expect-error
        reyhydrateDate(store.state.reminders, "when");
      }
    }),
  ],
  state: (): VuexStore => ({
    projects: [],
    boards: [],
    tasks: [],
    selectedProjects: [],
    reminders: {},
    categories: [],
    labels: [],
  }),
  getters: {
    getBoards: (state) => (projectId: number): Board[] => {
      return state.boards.filter(value => value.project === projectId);
    },
    getBoardTasks: (state) => (id: number): Task[] => {
      return state.tasks.filter(value => value.board === id);
    },
    getProjectTasks: (state) => (id: number): Task[] => {
      return state.tasks.filter(value => value.project === id);
    },
    getTask: (state) => (id: number): Task | undefined => {
      return state.tasks.find(value => value.id === id);
    },
    getFirstProject(state): null | Project {
      const firstSelected = state.selectedProjects[0];
      return firstSelected ? state.projects.find(value => firstSelected === value.id) || null : null;
    },
    getProject: (state) => (id: number): undefined | Project => {
      return state.projects.find(value => id === value.id);
    },
    getBoard: (state) => (id: number): undefined | Board => {
      return state.boards.find(value => id === value.id);
    },
  },
  mutations: {
    setProjects(state, projects: Project[]) {
      state.projects = projects;
    },
    addProject(state, project: Project) {
      state.projects.push(project);
    },
    removeProject(state, project: Project) {
      remove(state.boards, project);
    },
    toggleProjectSelect(state, { project, multi }: { project: Project, multi: boolean }) {
      const index = state.selectedProjects.indexOf(project.id);

      if (multi) {
        if (index < 0) {
          state.selectedProjects.push(project.id);
        } else {
          state.selectedProjects.splice(index, 1);
        }
      } else {
        state.selectedProjects = index < 0 ? [project.id] : [];
      }
    },
    setTasks(state, tasks: Task[]) {
      state.tasks = tasks;
    },
    addTask(state, task: Task) {
      state.tasks.push(task);
    },
    removeTask(state, board: Board) {
      remove(state.boards, board);
    },
    updateTask(state, task: Task) {
      const found = state.tasks.find(value => task.id === value.id);

      if (found) {
        Object.assign(found, task);
      }
    },
    setBoards(state, boards: Board[]) {
      state.boards = boards;
    },
    addBoard(state, board: Board) {
      state.boards.push(board);
    },
    removeBoard(state, board: Board) {
      remove(state.boards, board);
    },
    setCategories(state, values: Category[]) {
      state.categories = values;
    },
    addCategory(state, value: Category) {
      state.categories.push(value);
    },
    removeCategory(state, value: Category) {
      remove(state.categories, value);
    },
    setLabels(state, values: Label[]) {
      state.labels = values;
    },
    addLabel(state, value: Label) {
      state.labels.push(value);
    },
    removeLabel(state, value: Label) {
      remove(state.labels, value);
    },
    setReminders(state, reminder: Reminder[]) {
      const mapping: Record<number, Reminder[]> = {};
      reminder.forEach(value => (mapping[value.task] || (mapping[value.task] = [])).push(value));
      state.reminders = mapping;
    },
    addReminder(state, value: Reminder) {
      (state.reminders[value.task] || (state.reminders[value.task] = [])).push(value)
    },
    removeReminder(state, value: Reminder) {
      remove(state.reminders[value.task] || [], value);
    },
  },
  actions: {
    async addTask({ commit, state }, task: Create<Task>): Promise<Task> {
      try {
        task = await HttpClient.postApiTasks(task);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        task.id = nextId(state.tasks);
      }
      commit("addTask", task);
      return task as Task;
    },
    async updateBoardTasks({ commit }, payload: { items: Task[], boardId: number }) {
      const toChangeItems = await Promise.all(payload.items.filter(value => value.board !== payload.boardId).map(task => {
        return HttpClient.putApiTasksbyId({ ...task, board: payload.boardId }).catch(error => console.error(task, error))
      }));
      // as some update may have failed, filter them out and update the rest, we printed the error on the console
      toChangeItems.filter(value => value).forEach(value => commit("updateTask", value));
    },
    async addProject({ commit, state }, project: Create<Project>): Promise<Project> {
      try {
        project = await HttpClient.postApiProjects(project);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        project.id = nextId(state.projects);
      }
      commit("addProject", project);
      return project as Project;
    },
    async addBoard({ commit, state }, board: Create<Board>): Promise<Board> {
      try {
        board = await HttpClient.postApiBoards(board);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        board.id = nextId(state.boards);
      }
      commit("addBoard", board);
      return board as Board;
    },
    async addCategory({ commit, state }, category: Create<Category>): Promise<Category> {
      try {
        category = await HttpClient.postApiBoards(category);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        category.id = nextId(state.categories);
      }
      commit("addCategory", category);
      return category as Category;
    },
    async addLabel({ commit, state }, label: Create<Label>): Promise<Label> {
      try {
        label = await HttpClient.postApiLabels(label);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        label.id = nextId(state.labels);
      }
      commit("addLabel", label);
      return label as Label;
    },
    async addReminder({ commit, state }, reminder: Create<Reminder>): Promise<Reminder> {
      try {
        reminder = await HttpClient.postApiReminders(reminder);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        reminder.id = nextId(Object.values(state.reminders).flat());
      }
      commit("addReminder", reminder);
      return reminder as Reminder;
    },
    async sync({ commit, state }) {
      const projects = await sync(HttpClient.getApiProjects(), state.projects, value => HttpClient.postApiProjects(value));
      commit("setProjects", projects);

      const boards = await sync(HttpClient.getApiBoards(), state.boards, value => HttpClient.postApiBoards(value));
      commit("setBoards", boards);

      const tasks = await sync(HttpClient.getApiTasks(), state.tasks, value => HttpClient.postApiTasks(value));
      commit("setTasks", tasks);

      const categories = await sync(HttpClient.getApiCategories(), state.categories, value => HttpClient.postApiCategories(value));
      commit("setCategories", categories);

      const labels = await sync(HttpClient.getApiLabels(), state.labels, value => HttpClient.postApiLabels(value));
      commit("setLabels", labels);

      const reminders = await sync(HttpClient.getApiReminders(), Object.values(state.reminders).flat(), value => HttpClient.postApiReminders(value));
      commit("setReminders", reminders);
    }
  },
  modules: {}
});
