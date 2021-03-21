<template>
    <div class="h-100">
        <context-menu v-bind="contextMenu" @close="contextTaskId = null" />
        <div class="d-flex h-100">
            <div class="left-sidebar">
                <ul class="list-group list-group-flush">
                    <board-item
                        v-for="task in tasks"
                        :key="task.id"
                        :item="task"
                        @click.left="selectedTaskId = task.id"
                        @click.right.prevent.stop="
                            onContextClick($event, task.id)
                        "
                        class="list-group-item list-group-item-action"
                        :class="{ active: selectedTaskId === task.id }"
                        role="button"
                    />
                </ul>
            </div>
            <task-item class="flex-fill" :taskId="selectedTaskId" />
        </div>
    </div>
</template>

<script lang="ts">
import { Task } from "@/client";
import ContextMenu, { ContextMenuItem } from "@/components/context-menu.vue";
import taskItem from "@/components/task-item.vue";
import BoardItem from "@/components/BoardItem.vue";
import { ConfirmationModal } from "@/siteTypes";
import { defineComponent } from "vue";

export enum TimeView {
    TODAY = 0,
    TOMORROW = 1,
    NEXT_WEEK = 2,
    ALL = 3
}

export default defineComponent({
    name: "ListView",
    components: { taskItem, ContextMenu, BoardItem },
    props: {
        view: { type: Number, required: true }
    },
    data() {
        return {
            selectedTaskId: null as null | number,
            contextTaskId: null as null | number,
            contextX: 0,
            contextY: 0
        };
    },
    computed: {
        tasks(): Task[] {
            if (!Object.values(TimeView).includes(this.view)) {
                console.error(
                    `Erroreneous TimeView Value: '${this.view}', skipping filtering`
                );
                return this.$store.state.tasks;
            } else if (this.view === TimeView.ALL) {
                return this.$store.state.tasks;
            }
            let after = null as null | Date;
            let before = null as null | Date;

            if (this.view === TimeView.TODAY) {
                // after midnight today
                after = new Date();
                after.setHours(0, 0, 0, 0);

                // before midnight tomorrow
                before = new Date(after);
                before.setDate(before.getDate() + 1);
            } else if (this.view === TimeView.TOMORROW) {
                // after midnight tomorrow
                after = new Date();
                after.setDate(after.getDate() + 1);
                after.setHours(0, 0, 0, 0);

                // before midnight the day after tomorrow
                before = new Date(after);
                before.setDate(before.getDate() + 1);
            } else {
                // after midnight today
                after = new Date();
                after.setHours(0, 0, 0, 0);

                // before midnight in seven days
                before = new Date(after);
                before.setDate(before.getDate() + 7);
            }
            return this.$store.state.tasks.filter(task => {
                return (
                    (!after ||
                        (task.start && task.start > after) ||
                        (task.due && task.due > after)) &&
                    (!before ||
                        (task.start && task.start < before) ||
                        (task.due && task.due < before))
                );
            });
        },
        contextMenu(): any {
            return {
                items: this.contextItems,
                startY: this.contextY,
                startX: this.contextX,
                show: this.contextTaskId !== null
            };
        },
        contextItems(): ContextMenuItem[] {
            if (!this.contextTaskId) {
                return [];
            }
            const that = this; // eslint-disable-line @typescript-eslint/no-this-alias
            const currentId = this.contextTaskId;
            const store = this.$store;
            return [
                {
                    title: "Delete Task",
                    onClick() {
                        const task = store.getters.getTask(currentId);
                        store.commit("setConfirmationModal", {
                            title: `Are you sure you want to delete the Task: \n"${task?.title}" ?`,
                            onConfirm() {
                                store.dispatch("deleteTask", currentId);
                            },
                            onChoice() {
                                that.contextTaskId = null;
                            }
                        } as ConfirmationModal);
                    }
                }
            ];
        }
    },
    methods: {
        onContextClick(event: MouseEvent, taskId: number) {
            this.contextX = event.x;
            this.contextY = event.y;
            this.contextTaskId = taskId;
        }
    }
});
</script>

<style scoped>
.left-sidebar {
    width: 20em;
}
</style>