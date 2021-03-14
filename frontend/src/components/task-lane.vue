<template>
    <div class="task-lane card m-1 p-0">
        <div
            class="card-header d-flex justify-content-between align-content-center"
        >
            <span class="font-weight-bold align-middle">{{ board.title }}</span>
            <div>
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
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
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
                    <board-item :item="element" />
                </template>
            </vue-draggable>
        </div>
        <div class="card-footer text-muted">
            {{ itemCount }}
        </div>
    </div>
</template>

<script lang="ts">
import { Board, Task } from "@/client";
import { defineComponent, PropType } from "vue";
import BoardItem from "./BoardItem.vue";
import VueDraggable from "vuedraggable";
import { AddTaskModal } from "@/siteTypes";

export default defineComponent({
    name: "TaskLane",
    components: { BoardItem, VueDraggable },
    props: {
        board: {
            type: Object as PropType<Board>,
            required: true
        }
    },
    computed: {
        id(): string {
            return "list-setting-dropdown-" + this.board?.id;
        },
        items: {
            get(): Task[] {
                return this.$store.getters.getBoardTasks(this.board.id);
            },
            set(items: Task[]) {
                this.$store.dispatch("updateBoardTasks", {
                    items,
                    boardId: this.board.id
                });
            }
        },
        itemCount(): string {
            if (!this.items) return "";
            return this.items.length === 1
                ? "1 task"
                : `${this.items.length} tasks`;
        }
    },
    methods: {
        addTask() {
            this.$store.commit("setAddTaskModal", {
                project: this.board.project,
                board: this.board.id,
            } as AddTaskModal)
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