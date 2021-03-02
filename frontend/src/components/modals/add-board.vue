<template>
    <modal id="add-board-modal" :show="show" @submit="submitted" @close="$emit('close')">
        <template v-slot:title>
            Add Board
        </template>
        <template v-slot:body>
            <input id="board-name" class="custom-control" v-model="name" type="text" @keyup.enter="submitted" />
            <select v-model="project" class="custom-select">
                <option selected>Select Project of Board</option>
                <option
                    v-for="project in $store.state.projects"
                    :key="project.id"
                    :value="project.id"
                    >{{ project.title }}</option
                >
            </select>
        </template>
    </modal>
</template>

<script lang="ts">
import { Create, Board } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

export default defineComponent({
    name: "AddBoardModal",
    props: {
        show: Boolean
    },
    emits: ["finish", "close"],
    components: { modal },
    data() {
        const project = this.$store.getters.getFirstProject;
        return {
            name: "",
            project: (project?.id || null) as null | number
        };
    },
    mounted() {
        $("#add-board-modal").on("shown.bs.modal", () =>
            $("#board-name").trigger("focus")
        );
    },
    methods: {
        async submitted() {
            // TODO: handle error
            await this.$store.dispatch("addBoard", {
                title: this.name,
                project: this.project
            } as Create<Board>);

            this.name = "";

            this.$emit("finish");
            this.$emit("close");
        }
    }
});
</script>

<style>
</style>