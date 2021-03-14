<template>
    <div class="h-100">
        <context-menu v-bind="contextMenu" @close="contextTaskId = null"/>
        <div class="d-flex h-100">
            <div class="left-sidebar">
                <ul class="list-group list-group-flush">
                    <li
                        v-for="task in tasks"
                        :key="task.id"
                        @click.left="selectedTaskId = task.id"
                        @click.right.prevent.stop="onContextClick($event, task.id)"
                        class="list-group-item list-group-item-action"
                        :class="{ active: selectedTaskId === task.id }"
                        role="button"
                    >
                        {{ task.title }}
                    </li>
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
import { defineComponent } from "vue";

export default defineComponent({
    name: "ListView",
    components: { taskItem, ContextMenu },
    data() {
        return {
            selectedTaskId: null as null | number,
            contextTaskId: null as null | number,
            contextX: 0,
            contextY: 0,
        };
    },
    computed: {
        tasks(): Task[] {
            return this.$store.state.tasks;
        },
        contextMenu(): any {
            return {
                items: this.contextItems,
                startY: this.contextY,
                startX: this.contextX,
                show: this.contextTaskId !== null,
            };
        },
        contextItems(): ContextMenuItem[] {
            if (!this.contextTaskId) {
                return [];
            }
            const currentId = this.contextTaskId;
            const store = this.$store;
            return [
                {
                    title: "Delete Task",
                    onClick() {
                        store.dispatch("deleteTask", currentId);
                    }
                }
            ];
        }
    },
    methods: {
        onContextClick(event: MouseEvent, taskId: number) {
            console.log(taskId, event.x, event.y, event);
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