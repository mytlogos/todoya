<template>
    <div class="h-100">
        <div class="d-flex h-100">
            <div class="left-sidebar">
                <ul class="list-group list-group-flush">
                    <li
                        v-for="task in tasks"
                        :key="task.id"
                        @click.left="selectedTaskId = task.id"
                        class="list-group-item list-group-item-action"
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
import taskItem from "@/components/task-item.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "ListView",
    components: { taskItem },
    data() {
        return {
            selectedTaskId: null as null | number
        };
    },
    computed: {
        tasks(): Task[] {
            return this.$store.state.tasks;
        }
    }
});
</script>

<style scoped>
.left-sidebar {
    width: 20em;
}
</style>