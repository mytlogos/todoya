<template>
    <div class="d-flex">
        <div class="left-sidebar">
            <div class="m-2">Views</div>
            <ul class="list-group list-group-flush">
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'ListView' }"
                    tag="a"
                    >Today</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'ListView' }"
                    tag="a"
                    >Tomorrow</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'ListView' }"
                    tag="a"
                    >Next Week</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'ListView' }"
                    tag="a"
                    >All</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'Calendar' }"
                    tag="a"
                    >Calendar</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'Board' }"
                    tag="a"
                    >Board</router-link
                >
            </ul>
            <div class="m-2">Projects</div>
            <ul class="list-group list-group-flush">
                <a
                    v-for="project in projects"
                    :key="project.id"
                    :class="{ active: project.id === selectedProject }"
                    :aria-current="
                        project.id === selectedProject ? 'true' : 'false'
                    "
                    @click.left="
                        selectedProject.id === project
                            ? 0
                            : (selectedProject = project.id)
                    "
                    href="#"
                    class="list-group-item list-group-item-action"
                >
                    {{ project.title }}
                </a>
            </ul>
        </div>
        <div class="bg-light flex-fill">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { Project } from "@/client";
import { defineComponent } from "vue";

export default defineComponent({
    name: "Home",
    data() {
        return {
            selectedView: "",
            selectedProject: 0
        };
    },
    computed: {
        projects(): Project[] {
            return this.$store.state.projects;
        }
    }
});
</script>
<style scoped>
.left-sidebar {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    width: 10vw;
    overflow-y: auto;
}
</style>
