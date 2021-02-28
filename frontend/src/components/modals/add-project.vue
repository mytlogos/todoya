<template>
    <modal :show="show" @submit="submitted" @close="$emit('close')">
        <template v-slot:title>
            Add Project
        </template>
        <template v-slot:body>
            <input class="custom-control" v-model="name" type="text">
        </template>
    </modal>
</template>

<script lang="ts">
import { Create, Project } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";

export default defineComponent({
    name: "AddProjectModal",
    props: {
        show: Boolean
    },
    emits: ["finish", "close"],
    components: { modal },
    data() {
        return {
            name: "",
        };
    },
    watch: {
        show() {
            const root = this.$el as HTMLElement;
            console.log("should focus", root, this.show);
            if (!root) {
                return;
            }
            if (this.show) {
                root.querySelector("input")?.focus();
            }
        }
    },
    methods: {
        async submitted() {
            // TODO: handle error
            await this.$store.dispatch("addProject", {
                title: this.name,
            } as Create<Project>);

            this.name = "";
            this.$emit("finish");
            this.$emit("close");
        }
    }
});
</script>

<style>
</style>