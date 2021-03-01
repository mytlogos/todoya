<template>
    <modal id="add-project-modal" :show="show" @submit="submitted" @close="$emit('close')">
        <template v-slot:title>
            Add Project
        </template>
        <template v-slot:body>
            <input id="project-name" class="custom-control" v-model="name" type="text">
        </template>
    </modal>
</template>

<script lang="ts">
import { Create, Project } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

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
    mounted() {
        $("#add-project-modal").on("shown.bs.modal", () =>
            $("#project-name").trigger("focus")
        );
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