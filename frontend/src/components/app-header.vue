<template>
    <nav class="navbar navbar-expand-xl">
        <router-link
            :to="{ name: 'Home' }"
            tag="a"
            class="nav-link navbar-brand"
        >
            Todoya
        </router-link>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a
                        class="nav-link btn"
                        @click.left="showAddProject = true"
                    >
                        Add Project
                    </a>
                </li>
                <li class="nav-item">
                    <router-link
                        to="/"
                        tag="a"
                        class="nav-link"
                    >
                        Settings
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
    <teleport to="body">
        <add-project :show="showAddProject" @close="showAddProject = false"/>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import addProject from "./modals/add-project.vue";

export default defineComponent({
    components: { addProject },
    name: "AppHeader",
    data() {
        return {
            showAddProject: false
        };
    },
});
</script>

<style scoped>
nav * {
	color: #fff !important;
}
nav {
  background-color: mediumseagreen;
}
</style>
