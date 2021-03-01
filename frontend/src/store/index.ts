import { Board, Create, Entity, Project, Task } from "@/client";
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

export default createStore({
  plugins: [
    createLogger(),
    persistedState(),
  ],
  state: (): VuexStore => ({
    projects: [],
    boards: [],
    tasks: [],
    selectedProjects: []
  }),
  getters: {
    getBoards: (state) => (id: number): Board[] => {
      return state.boards.filter(value => value.project === id);
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
  },
  mutations: {
    setProject(state, projects: Project[]) {
      state.projects = projects;
    },
    addProject(state, project: Project) {
      state.projects.push(project);
    },
    removeProject(state, project: Project) {
      remove(state.boards, project);
    },
    toggleProjectSelect(state, project: Project) {
      const index = state.selectedProjects.indexOf(project.id);

      if (index < 0) {
        state.selectedProjects.push(project.id);
      } else {
        state.selectedProjects.splice(index, 1);
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
    async addTask({ commit, state }, task: Create<Task>) {
      task.id = nextId(state.tasks);
      commit("addTask", task);
    },
    async addProject({ commit, state }, project: Create<Project>) {
      project.id = nextId(state.projects);
      commit("addProject", project);
    },
    async addBoard({ commit, state }, board: Create<Board>) {
      board.id = nextId(state.boards);
      commit("addBoard", board);
    },
  },
  modules: {}
});
