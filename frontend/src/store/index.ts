import { Actions, BoardActionsPlugin, Condition } from "@/actions";
import { Board, Category, CheckList, CheckItem, Create, Entity, HttpClient, Label, Project, Reminder, reyhydrateDate, Task, Priority, PriorityList, Action } from "@/client";
import { VuexStore } from "@/siteTypes";
import { Commit, createLogger, createStore, Dispatch } from "vuex";
import persistedState from "vuex-persistedstate";

function remove<T>(list: T[], value: T) {
  const index = list.indexOf(value);
  if (index >= 0) {
    list.splice(index, 1);
  }
}

function removeEntity<T extends Entity>(list: T[], id: number) {
  const index = list.findIndex(value => value.id === id);

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
      .filter(value => value && !ids.has(value.id))
      .map(value => create(value).then(created => onlineValues.push(created)))
  );

  return onlineValues;
}

function notifyReminder(getters: any, reminder: Reminder, state: VuexStore, commit: Commit, dispatch: Dispatch) {
  const value = state.reminderNotifications[reminder.id];

  if (!value || !value.finished) {
    const now = new Date();
    const msTillNotification = reminder.when < now ? 0 : reminder.when.getTime() - now.getTime();
    console.log(`Notify in: ${msTillNotification} milliseconds`)

    commit("updateReminderNotification", {
      id: reminder.id,
      timeoutId: setTimeout(() => {
        if (Notification.permission === "denied") {
          console.error("Cannot show Reminder Notification: Permission denied");
          return;
        }
        const task = getters.getTask(reminder.task) as Task;
        const notification = new Notification(task.title, {
          requireInteraction: true
        });
        notification.addEventListener("close", () => dispatch("removeReminder", reminder.id))
      }, msTillNotification),
    });
  }
}

function findCheckList(checkLists: Record<number, CheckList[]>, checkListId: number): CheckList | undefined {
  for (const value of Object.values(checkLists)) {
    const found = value.find(list => list.id === checkListId);

    if (found) {
      return found;
    }
  }
}

function updateEntity<T extends Entity>(entities: T[], entity: T) {
  const found = entities.find(value => entity.id === value.id);

  if (found) {
    Object.assign(found, entity);
  } else {
    throw Error("Cannot update Update, does not exist: " + JSON.stringify(entity));
  }
}

export default createStore({
  devtools: true,
  plugins: [
    createLogger(),
    persistedState({
      rehydrated: store => {
        // always destroy any confirmationsmodal
        store.state.confirmationModal = null

        // remove ids as they are now invalid
        for (const value of Object.values(store.state.reminderNotifications)) {
          value.timeoutId = 0;
        }
        // rehydrate dates
        // @ts-expect-error
        reyhydrateDate(store.state.tasks, "start", "due", "completion_date");
        // @ts-expect-error
        reyhydrateDate(store.state.reminders, "when");
      }
    }),
    BoardActionsPlugin()
  ],
  state: (): VuexStore => ({
    projects: [],
    boards: [],
    tasks: [],
    selectedProjects: [],
    reminders: {},
    categories: [],
    labels: [],
    reminderNotifications: {},
    notificationsSettings: { requested: false },
    editTask: null,
    confirmationModal: null,
    addTaskModal: null,
    editProjectModal: null,
    checkLists: {},
    priorityLists: {},
    actions: {},
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
    getCheckLists: (state) => (id: number): CheckList[] => {
      return state.checkLists[id] || [];
    },
    getActions: (state) => (id: number): Action[] => {
      return state.actions[id] || [];
    },
    getPriorities: (state) => (projectId: number): Priority[] => {
      return state.priorityLists[projectId]?.items || [];
    }
  },
  mutations: {
    setProjects(state, projects: Project[]) {
      state.projects = projects;
    },
    addProject(state, project: Project) {
      state.projects.push(project);
    },
    updateProject(state, project: Project) {
      updateEntity(state.projects, project);
    },
    removeProject(state, project: Project) {
      remove(state.projects, project);
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
    editTask(state, taskId: number | null) {
      state.editTask = taskId;
    },
    setTasks(state, tasks: Task[]) {
      state.tasks = tasks;
    },
    addTask(state, task: Task) {
      state.tasks.push(task);
    },
    removeTask(state, task: Task | number) {
      if (Number.isInteger(task)) {
        removeEntity(state.tasks, task as number);
      } else {
        remove(state.tasks, task);
      }
    },
    updateTask(state, task: Task) {
      updateEntity(state.tasks, task);
    },
    setBoards(state, boards: Board[]) {
      state.boards = boards;
    },
    addBoard(state, board: Board) {
      state.boards.push(board);
    },
    updateBoard(state, board: Board) {
      updateEntity(state.boards, board);
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
    updateReminderNotification(state, value: any) {
      state.reminderNotifications[value.id] = value;
    },
    finishReminderNotification(state, id: number) {
      if (!state.reminderNotifications[id]) {
        console.error("Cannot finish reminder notification: None available");
      } else {
        state.reminderNotifications[id].finished = true;
      }
    },
    removeReminderNotification(state, id: number) {
      delete state.reminderNotifications[id];
    },
    notifications(state, value: any) {
      state.notificationsSettings = value;
    },
    setConfirmationModal(state, value: any) {
      state.confirmationModal = value;
    },
    setAddTaskModal(state, value: any) {
      state.addTaskModal = value;
    },
    setEditProjectModal(state, value: any) {
      state.editProjectModal = value;
    },
    setPriorityLists(state, priorityLists: PriorityList[]) {
      const mapping: Record<number, PriorityList> = {};
      priorityLists.forEach(value => mapping[value.project] = value);
      state.priorityLists = mapping;
    },
    addPriorityList(state, value: PriorityList) {
      state.priorityLists[value.project] = value;
    },
    updatePriorityList(state, value: PriorityList) {
      const found = state.priorityLists[value.project]

      if (found) {
        Object.assign(found, value);
      } else {
        console.warn("Cannot update prioritylist, does not exist in store");
      }
    },
    removePriorityList(state, value: PriorityList) {
      delete state.priorityLists[value.project];
    },
    setActions(state, actions: Action[]) {
      const mapping: Record<number, Action[]> = {};
      actions.forEach(value => (mapping[value.board] || (mapping[value.board] = [])).push(value));
      state.actions = mapping;
    },
    addAction(state, value: Action) {
      const actions = state.actions[value.board] || (state.actions[value.board] = []);

      if (actions.find(other => other.id === value.id)) {
        console.warn("Do not add duplicate checklist")
        return;
      }
      actions.push(value);
    },
    updateAction(state, value: Action) {
      const checklists = state.actions[value.board];

      let found;

      if (checklists) {
        found = checklists.find(other => other.id === value.id);
      }

      if (found) {
        Object.assign(found, value);
      } else {
        console.warn("Cannot update checklist, does not exist in store");
      }
    },
    removeAction(state, value: Action) {
      const checklists = state.actions[value.board];

      if (checklists) {
        removeEntity(checklists, value.id);
      }
    },
    setCheckLists(state, checkLists: CheckList[]) {
      const mapping: Record<number, CheckList[]> = {};
      checkLists.forEach(value => (mapping[value.task] || (mapping[value.task] = [])).push(value));
      state.checkLists = mapping;
    },
    addCheckList(state, value: CheckList) {
      const checkLists = state.checkLists[value.task] || (state.checkLists[value.task] = []);

      if (checkLists.find(other => other.id === value.id)) {
        console.warn("Do not add duplicate checklist")
        return;
      }
      checkLists.push(value);
    },
    updateCheckList(state, value: CheckList) {
      const checklists = state.checkLists[value.task];

      let found;

      if (checklists) {
        found = checklists.find(other => other.id === value.id);
      }

      if (found) {
        Object.assign(found, value);
      } else {
        console.warn("Cannot update checklist, does not exist in store");
      }
    },
    removeCheckList(state, value: CheckList) {
      const checklists = state.checkLists[value.task];

      if (checklists) {
        removeEntity(checklists, value.id);
      }
    },
    addCheckItem(state, value: CheckItem) {
      const list = findCheckList(state.checkLists, value.id);

      if (list) {
        list.items.push({ ...value });
      }
    },
    updateCheckItem(state, value: CheckItem) {
      const list = findCheckList(state.checkLists, value.list);

      if (list) {
        const index = list.items.findIndex(item => item.id === value.id);

        if (index < 0) {
          console.error("Cannot update CheckItem, does not exist in store");
        } else {
          Object.assign(list.items[index], value);
        }
      } else {
        console.error("Cannot update CheckItem, its Checklist does not exist in store");
      }
    },
    removeCheckItem(state, value: CheckItem) {
      const list = findCheckList(state.checkLists, value.id);

      if (list) {
        removeEntity(list.items, value.id);
      }
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
    async updateTask({ commit }, task: Task): Promise<Task> {
      await HttpClient.putApiTasksbyId(task);
      commit("updateTask", task);
      return task;
    },
    async deleteTask({ commit }, taskId: number): Promise<void> {
      await HttpClient.deleteApiTasksbyId(taskId);
      commit("removeTask", taskId);
    },
    async addAction({ commit }, action: Create<Action>): Promise<Action> {
      const createdAction = await HttpClient.postApiActions(action);
      action.id = createdAction.id;
      commit("addAction", action);
      return action as Action;
    },
    async updateAction({ commit }, action: Action): Promise<Action> {
      await HttpClient.putApiActionsbyId(action);
      commit("updateAction", action);
      return action;
    },
    async deleteAction({ commit }, action: Action): Promise<void> {
      await HttpClient.deleteApiActionsbyId(action.id);
      commit("removeAction", action);
    },
    async addCheckList({ commit }, checkList: Create<CheckList>): Promise<CheckList> {
      const createdList = await HttpClient.postApiCheckLists(checkList);
      checkList.id = createdList.id;

      checkList.items = await Promise.all(
        checkList.items.map(checkItem => {
          checkItem.list = checkList.id as number;
          return HttpClient.postApiCheckItems(checkItem);
        })
      )

      commit("addCheckList", checkList);
      return checkList as CheckList;
    },
    async updateCheckList({ commit }, checkList: CheckList): Promise<CheckList> {
      await HttpClient.putApiCheckListsbyId(checkList);
      commit("updateCheckList", checkList);
      return checkList;
    },
    async deleteCheckList({ commit }, checkList: CheckList): Promise<void> {
      await HttpClient.deleteApiCheckListsbyId(checkList.id);
      commit("removeCheckList", checkList);
    },
    async addCheckItem({ commit }, checkItem: Create<CheckItem>): Promise<CheckItem> {
      checkItem = await HttpClient.postApiCheckItems(checkItem);
      commit("addCheckItem", checkItem);
      return checkItem as CheckItem;
    },
    async updateCheckItem({ commit }, checkItem: CheckItem): Promise<CheckItem> {
      await HttpClient.putApiCheckItemsbyId(checkItem);
      commit("updateCheckItem", checkItem);
      return checkItem;
    },
    async deleteCheckItem({ commit }, checkItem: CheckItem): Promise<void> {
      await HttpClient.deleteApiCheckItemsbyId(checkItem.id);
      commit("removeCheckItem", checkItem);
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
    async updateProject({ commit }, project: Project): Promise<Project> {
      await HttpClient.putApiProjectsbyId(project);
      commit("updateProject", project);
      return project;
    },
    async deleteProject({ commit }, project: Project): Promise<void> {
      await HttpClient.deleteApiProjectsbyId(project.id);
      commit("removeProject", project);
    },
    async addPriorityList({ commit, state }, priorityList: Create<PriorityList>): Promise<PriorityList> {
      try {
        priorityList = await HttpClient.postApiPriorityLists(priorityList);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        priorityList.id = nextId(state.projects);
      }
      commit("addPriorityList", priorityList);
      return priorityList as PriorityList;
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
    async updateBoard({ commit }, board: Board): Promise<Board> {
      try {
        await HttpClient.putApiBoardsbyId(board);
      } catch (error) {
        console.error(error);
      }
      commit("updateBoard", board);
      return board;
    },
    async addCategory({ commit, state }, category: Create<Category>): Promise<Category> {
      try {
        category = await HttpClient.postApiCategories(category);
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
    async addReminder({ commit, state, getters, dispatch }, reminder: Create<Reminder>): Promise<Reminder> {
      try {
        reminder = await HttpClient.postApiReminders(reminder);
      } catch (error) {
        console.error(error);
        // generate temporary id when it fails
        reminder.id = nextId(Object.values(state.reminders).flat());
      }
      commit("addReminder", reminder);
      notifyReminder(getters, reminder as Reminder, state, commit, dispatch);
      return reminder as Reminder;
    },
    async removeReminder({ commit, state }, reminderId: number): Promise<void> {
      try {
        await HttpClient.deleteApiRemindersbyId(reminderId);
      } catch (error) {
        console.error(error);
      }
      for (const values of Object.values(state.reminders)) {
        const reminder = values.find(value => value && value.id === reminderId);
        if (reminder) {
          commit("removeReminder", reminder);
          break;
        }
      }
      commit("removeReminderNotification", reminderId);
    },
    async sync({ commit, state, getters, dispatch }) {
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
      reminders.forEach(reminder => notifyReminder(getters, reminder, state, commit, dispatch));
      commit("setReminders", reminders);

      // TODO: add newly added checkitems
      const checkLists = await sync(HttpClient.getApiCheckLists(), Object.values(state.checkLists).flat(), value => HttpClient.postApiCheckLists(value));
      commit("setCheckLists", checkLists);

      // TODO: add newly added priorityitems
      const priorityLists = await sync(HttpClient.getApiPriorityLists(), Object.values(state.priorityLists).flat(), value => HttpClient.postApiPriorityLists(value));
      commit("setPriorityLists", priorityLists);

      // TODO: add newly added actions
      const actions = await sync(HttpClient.getApiActions(), Object.values(state.actions).flat(), value => HttpClient.postApiActions(value));
      commit("setActions", actions);
    }
  },
  modules: {}
});
