<template>
    <div>
        <template
            v-for="projectId in $store.state.selectedProjects"
            :key="projectId"
        >
            <div class="h3 p-2">
                {{ $store.getters.getProject(projectId)?.title }}
            </div>
            <project-board :id="projectId" class="row m-0" />
        </template>
    </div>
    <teleport to="body">
        <edit-task
            :show="$store.state.editTask !== null"
            :taskId="$store.state.editTask"
            @close="$store.commit('editTask', null)"
        />
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProjectBoard from "@/components/project-board.vue";
import EditTask from "@/components/modals/edit-task.vue";

export default defineComponent({
    name: "Board",
    components: { ProjectBoard, EditTask },
});
</script>

<style>
</style>