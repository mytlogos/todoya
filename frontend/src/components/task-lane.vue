<template>
    <div class="task-lane card m-1 p-0">
        <h3 class="card-header">{{ board.title }}</h3>
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
        items: {
            get(): Task[] {
                return this.$store.getters.getBoardTasks(this.board.id);
            },
            set(items: Task[]) {
                this.$store.commit("updateBoardTasks", {
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
    }
});
</script>

<style scoped>
.task-lane {
    max-width: 20em;
}
.task-lane > .card-body > div {
    min-height: 50px;
    height: 100%;
}
</style>