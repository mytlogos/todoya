<template>
    <div>
        <template
            v-for="project in $store.state.selectedProjects"
            :key="project"
        >
            <div class="h3 p-2">
                {{ $store.getters.getProject(project)?.title }}
            </div>
            <div class="row m-0">
                <task-lane
                    v-for="board in $store.getters.getBoards(project)"
                    :key="board.id"
                    :board="board"
                    class="col-md"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskLane from "@/components/task-lane.vue";

export default defineComponent({
    name: "Board",
    components: { TaskLane }
});
</script>

<style>
</style>