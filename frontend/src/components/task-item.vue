<template>
    <div>
        <template v-if="task">
            <h1>{{ task.title }}</h1>
            <div>
                <span>Project:</span> {{ $store.getters.getProject(task.project)?.title || "None" }}
            </div>
            <div>
                <span>Board:</span> {{ $store.getters.getBoard(task.board)?.title || "None" }}
            </div>
            <div>
                <span>Parent Task:</span> {{ parentTask?.title || "None" }}
            </div>
            <div>
                <span>Start Time:</span> {{ task.start?.toLocaleString() || "None" }}
            </div>
            <div>
                <span>Due Time:</span> {{ task.due?.toLocaleString() || "None" }}
            </div>
            <div v-if="taskChildren.length">
                <div>Subtasks:</div>
                <ul class="list-group list-group-flush">
                <a
                    v-for="child in taskChildren"
                    :key="child.id"
                    href="#"
                    class="list-group-item list-group-item-action"
                >
                    {{ child.title }}
                </a>
            </ul>
            </div>
            <h3>Description</h3>
            <p>{{ task.description || "No Description available" }}</p>
        </template>
        <template v-else>
            <span class="h-100 d-flex align-items-center justify-content-center">Sorry no Task is available</span>
        </template>
    </div>
</template>

<script lang="ts">
import { Task } from "@/client";
import { defineComponent } from "vue";
export default defineComponent({
    name: "TaskItem",
    props: {
        taskId: {
            type: Number,
            required: false
        }
    },
    computed: {
        task(): Task | undefined {
            return this.$store.getters.getTask(this.taskId);
        },
        parentTask(): Task | undefined {
            return this.task && this.$store.getters.getTask(this.task.parent_task);
        },
        taskChildren(): Task[] {
            return this.$store.state.tasks.filter(value => value.parent_task === this.taskId);
        },
    }
});
</script>

<style>
</style>