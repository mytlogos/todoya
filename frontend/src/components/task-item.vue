<template>
    <div>
        <template v-if="task">
            <h1>{{ task.title }}</h1>
            <h3>Description</h3>
            <p>{{ task.description }}</p>
        </template>
        <template v-else>
            <span class="h-100 d-flex align-items-center justify-content-center">Sorry no Task is available</span>
        </template>
    </div>
</template>

<script lang="ts">
import { Task } from "@/client";
import { defineComponent, PropType } from "vue";
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
            return this.$store.state.tasks.find(
                task => this.taskId === task.id
            );
        }
    }
});
</script>

<style>
</style>