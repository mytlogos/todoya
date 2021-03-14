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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProjectBoard from "@/components/project-board.vue";

export default defineComponent({
    name: "Board",
    components: { ProjectBoard },
});
</script>

<style>
</style>