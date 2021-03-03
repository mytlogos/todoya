import { Board, Create, Entity, HttpClient, Project, Task } from "@/client";
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

async function sync<T extends Entity>(online: Promise<Array<T>>, current: T[], create: (value : T) => Promise<any>): Promise<T[]> {
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
        store.state.tasks.forEach(task => {
          task.start = task.start && new Date(task.start);
          task.due = task.due && new Date(task.due);
        })
      }
    }),
  ],
  state: (): VuexStore => ({
    projects: [],
    boards: [],
    tasks: [],
    selectedProjects: []
  }),
  getters: {
    getBoards: (state) => (projectId: number): Board[] => {
      return state.boards.filter(value => value.project === projectId);
    },
    getBoardTasks: (state) => (id: number): Board[] => {
      return state.tasks.filter(value => value.board === id);
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
    updateBoardTasks(state, { items, boardId }) {
      items.forEach((value: Task) => value.board = boardId);
    },
    setBoards(state, boards: Board[]) {
      state.boards = boards;
    },
    addBoard(state, board: Board) {
      state.boards.push(board);
    },
    removeBoard(state, board: Board) {
      remove(state.boards, board);
    }
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
    async sync({ commit, state }) {
      const projects = await sync(HttpClient.getApiProjects(), state.projects, value => HttpClient.postApiProjects(value));
      commit("setProjects", projects);

      const boards = await sync(HttpClient.getApiBoards(), state.boards, value => HttpClient.postApiBoards(value));
      commit("setBoards", boards);

      const tasks = await sync(HttpClient.getApiTasks(), state.tasks, value => HttpClient.postApiTasks(value));
      commit("setTasks", tasks);
    }
  },
  modules: {}
});
