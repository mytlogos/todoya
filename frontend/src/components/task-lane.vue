<template>
    <div class="task-lane card m-1 p-0 h-100">
        <div
            class="card-header d-flex justify-content-between align-content-center"
        >
            <editable-text
                @submit="updateBoardTitle"
                v-model="title"
                class="flex-fill font-weight-bold align-middle"
            />
            <div class="text-nowrap">
                <button
                    class="fas fa-plus btn btn-sm text-black-50"
                    role="button"
                    @click="addTask"
                    title="Add a Task to this Board"
                >
                    <span class="font-weight-normal p-1">Task</span>
                </button>
                <div class="dropdown d-inline-block">
                    <button
                        class="fas btn fa-ellipsis-v text-black-50 btn-sm"
                        type="button"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        :id="id"
                    ></button>
                    <div class="dropdown-menu" :aria-labelledby="id">
                        <a
                            v-for="item in boardActions"
                            :key="item.title"
                            class="dropdown-item"
                            href="#"
                            @click="toggleAction(item)"
                            :class="{ 'pl-1': item.isActive }"
                        >
                            <i v-if="item.isActive" class="fas fa-check"></i>
                            {{ item.title }}
                        </a>
                        <div
                            class="dropdown dropright"
                            @mouseenter="showDropdown"
                            @mouseleave="hideDropdown"
                        >
                            <a
                                ref="sortRef"
                                class="dropdown-item"
                                href="#"
                                data-toggle="dropdown"
                            >
                                Sorted by: {{ currentSort.title }}
                            </a>
                            <div
                                class="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <a
                                    v-for="sort in sorter"
                                    :key="sort.key"
                                    class="dropdown-item"
                                    href="#"
                                    @click="updateSort(sort)"
                                    >{{ sort.title }}
                                </a>
                            </div>
                        </div>
                        <a class="dropdown-item" href="#"
                            >Something else here</a
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <vue-draggable v-model="items" , item-key="id" group="tasklane">
                <template #item="{element}">
                    <board-item :item="element" :priorityList="priorityList" />
                </template>
            </vue-draggable>
        </div>
        <div class="card-footer text-muted">
            {{ itemCount }}
        </div>
    </div>
</template>

<script lang="ts">
import { Action, Board, Create, Priority, Task } from "@/client";
import { defineComponent, PropType } from "vue";
import BoardItem from "./BoardItem.vue";
import VueDraggable from "vuedraggable";
import { AddTaskModal } from "@/siteTypes";
import EditableText from "./editable-text.vue";
import { Actions, Condition } from "@/actions";
import $ from "jquery";

interface BoardAction {
    title: string;
    condition: Condition;
    action: keyof typeof Actions;
    isActive: boolean;
}

interface Sorter {
    title: string;
    key: keyof Task;
    defaultOrder: 1 | -1;
}

export default defineComponent({
    name: "TaskLane",
    components: { BoardItem, VueDraggable, EditableText },
    props: {
        board: {
            type: Object as PropType<Board>,
            required: true
        }
    },
    data() {
        return {
            title: this.board.title,
            boardActions: [
                {
                    title: "Set as Done Board",
                    condition: Condition.MOVING_TO,
                    action: "set_completion_date_to_now",
                    isActive: false
                }
            ] as BoardAction[],
            sorter: [
                { title: "Id", key: "id", defaultOrder: -1 },
                { title: "Completion", key: "completion_date", defaultOrder: -1 },
                { title: "Due", key: "due", defaultOrder: -1 },
                { title: "Start", key: "start", defaultOrder: -1 },
                { title: "Priority", key: "priority", defaultOrder: -1 },
                { title: "Title", key: "title", defaultOrder: 1 }
            ] as Sorter[]
        };
    },
    computed: {
        currentSort(): Sorter {
            return (
                this.sorter.find(value => this.board.sort_by === value.key) ||
                this.sorter[0]
            );
        },
        id(): string {
            return "list-setting-dropdown-" + this.board?.id;
        },
        items: {
            get(): Task[] {
                return this.$store.getters
                    .getBoardTasks(this.board.id)
                    .sort((a: Task, b: Task) => {
                        const valueA = a[this.currentSort.key];
                        const valueB = b[this.currentSort.key];
                        const order =  this.currentSort.defaultOrder

                        if (valueA && valueB) {
                            return valueA < valueB
                                ? -1 * order
                                : valueB < valueA
                                ? 1 * order
                                : 0;
                        } else if (!valueA && valueB) {
                            return -1 * order;
                        } else if (valueA && !valueB) {
                            return 1 * order;
                        } else {
                            return 0;
                        }
                    });
            },
            set(items: Task[]) {
                this.$store.dispatch("updateBoardTasks", {
                    items,
                    boardId: this.board.id
                });
            }
        },
        priorityList(): Priority[] {
            return this.$store.getters.getPriorities(this.board.project);
        },
        itemCount(): string {
            if (!this.items) return "";
            return this.items.length === 1
                ? "1 task"
                : `${this.items.length} tasks`;
        }
    },
    watch: {
        "board.title"(title) {
            this.title = title;
        },
        "$store.state.actions"(actions) {
            const boardActions = actions[this.board.id];

            if (boardActions) {
                this.boardActions.forEach(item => {
                    item.isActive = !!boardActions.find(
                        (action: Action) =>
                            action.condition == item.condition &&
                            action.action === item.action
                    );
                });
            }
        }
    },
    mounted() {
        $(this.$refs.sortRef as HTMLElement).dropdown();
    },
    methods: {
        hideDropdown() {
            $(this.$refs.sortRef as HTMLElement).dropdown("hide");
        },
        showDropdown() {
            $(this.$refs.sortRef as HTMLElement).dropdown("show");
        },
        updateSort(sorter: Sorter) {
            this.$store
                .dispatch("updateBoard", { ...this.board, sort_by: sorter.key })
                .catch(console.error);
        },
        toggleAction(action: BoardAction) {
            if (!action.isActive) {
                this.$store
                    .dispatch("addAction", {
                        condition: action.condition,
                        action: action.action,
                        board: this.board.id
                    } as Create<Action>)
                    .then(() => (action.isActive = false))
                    .catch(console.error);
            }
        },
        updateBoardTitle() {
            if (this.title === this.board.title) {
                return;
            }
            this.$store
                .dispatch("updateBoard", { ...this.board, title: this.title })
                .catch(console.error);
        },
        addTask() {
            this.$store.commit("setAddTaskModal", {
                project: this.board.project,
                board: this.board.id
            } as AddTaskModal);
        }
    }
});
</script>

<style scoped>
.task-lane {
    max-width: 20em;
}
.task-lane .board-task ~ .board-task {
    margin-top: 0.25em;
}
.task-lane > .card-body > div {
    min-height: 50px;
    height: 100%;
}
.task-lane > .card-header .btn:hover {
    background-color: gray;
    color: whitesmoke !important;
}
</style>