import { Store } from "vuex";
import { Action, Board, Task } from "./client";
import { VuexStore } from "./siteTypes";

export enum Condition {
    MOVING_TO,
    MOVING_FROM,
}

export const Actions = {
    set_completion_date_to_now: {
        name: "Set as completed now",
        handler(_board: Board, task: Task): Task | undefined {
            if (task.completion_date) {
                return;
            }
            return { ...task, completion_date: new Date() };
        }
    }
};

export const BoardActionsPlugin = () => (store: Store<VuexStore>) => {
    const currentTaskBoardMapping: Record<number, number> = {};
    
    function handle(condition: Condition, task: Task) {
        const board = store.getters.getBoard(task.board) as Board | undefined;
        
        if (!board) {
            return;
        }
        
        let currentTask = task;
        const actions = store.getters.getActions(board.id) as Action[];

        // do not compare strictly, as action.condition may be a stringified number and
        // condition a number
        actions.filter(action => action.condition == condition).forEach(action => {
            const changedTask = Actions[action.action].handler(board, currentTask);
            
            if (changedTask) {
                currentTask = changedTask;
            }
        });

        if (currentTask !== task) {
            store.dispatch("updateTask", currentTask)
        }
    }
    

    store.subscribe(mutation => {
        if (mutation.type === "addTask") {
            currentTaskBoardMapping[mutation.payload.id] = mutation.payload.board;
            handle(Condition.MOVING_TO, mutation.payload);

        } else if (mutation.type === "updateTask") {
            const previousBoardId = currentTaskBoardMapping[mutation.payload.id];

            if (mutation.payload.board !== previousBoardId) {
                currentTaskBoardMapping[mutation.payload.id] = mutation.payload.board;
                handle(Condition.MOVING_TO, mutation.payload);
            }
        } else if (mutation.type === "setTasks") {
            mutation.payload.forEach((element: Task) => {
                currentTaskBoardMapping[element.id] = element.board || 0;
                handle(Condition.MOVING_TO, element);
            });
        }
    });
}