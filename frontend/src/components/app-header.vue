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
                    <router-link
                        to="/"
                        tag="a"
                        class="nav-link"
                    >
                        Add Project
                    </router-link>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "AppHeader"
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
