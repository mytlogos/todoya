<template>
    <nav class="navbar navbar-expand-md">
        <router-link
            :to="{ name: 'Home' }"
            tag="a"
            class="nav-link navbar-brand"
        >
            Todoya
        </router-link>
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarSupportedContent" class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link btn" @click.left="showAddProject = true">
                        Add Project
                    </a>
                </li>
                <li>
                    <a class="nav-link btn" @click.left="showAddBoard = true">
                        Add Board
                    </a>
                </li>
                <li>
                    <a class="nav-link btn" @click.left="$store.state.addTaskModal = true">
                        Add Task
                    </a>
                </li>
                <li class="nav-item">
                    <router-link to="/" tag="a" class="nav-link">
                        Settings
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
    <teleport to="body">
        <add-project :show="showAddProject" @close="showAddProject = false" />
        <add-board :show="showAddBoard" @close="showAddBoard = false" />
        <add-task />
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddBoard from "./modals/add-board.vue";
import addProject from "./modals/add-project.vue";
import AddTask from "./modals/add-task.vue";

export default defineComponent({
    components: { addProject, AddBoard, AddTask },
    name: "AppHeader",
    data() {
        return {
            showAddProject: false,
            showAddBoard: false
        };
    }
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
