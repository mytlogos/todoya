<template>
    <div class="vh-100 bg-white d-flex flex-column">
        <app-header />
        <router-view class="flex-fill" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "@/components/app-header.vue";

export default defineComponent({
    name: "Home",
    components: {
        AppHeader
    },
    async created() {
        await this.$store.dispatch("sync");
    }
});
</script>
