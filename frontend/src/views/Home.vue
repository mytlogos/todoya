<template>
    <div class="d-flex">
        <div class="left-sidebar">
            <div class="m-2">Views</div>
            <ul class="list-group list-group-flush">
                <router-link
                    :to="{ name: 'ListView', query: { view: 0 } }"
                    tag="a"
                    >Today</router-link
                >
                <router-link
                    :to="{ name: 'ListView', query: { view: 1 } }"
                    tag="a"
                    >Tomorrow</router-link
                >
                <router-link
                    :to="{ name: 'ListView', query: { view: 2 } }"
                    tag="a"
                    >Next Week</router-link
                >
                <router-link
                    :to="{ name: 'ListView', query: { view: 3 } }"
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
                    :class="{ active: selectedProjects.includes(project.id) }"
                    :aria-current="
                        selectedProjects.includes(project.id) ? 'true' : 'false'
                    "
                    @click.left.prevent="toggle(project, $event)"
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
import { mapState } from "vuex";

export default defineComponent({
    name: "Home",
    data() {
        return {
            selectedView: ""
        };
    },
    computed: {
        ...mapState(["projects", "selectedProjects"])
    },
    methods: {
        toggle(project: Project, event: MouseEvent) {
            this.$store.commit("toggleProjectSelect", {project, multi: event.ctrlKey});
        }
    }
});
</script>
<style>
.left-sidebar {
    border-right: 5px solid rgba(0, 0, 0, 0.1);
    width: 10vw;
    overflow-y: auto;
    min-width: 10em;
    height: calc(100vh - 60px); /* take 100% of viewport height minus the nav header */
}
</style>
