<template>
    <modal
        id="add-project-modal"
        :show="show"
        @submit="submitted"
        @close="$emit('close')"
        @keyup.enter.ctrl="submitted"
    >
        <template v-slot:title>
            Add Project
        </template>
        <template v-slot:body>
            <input
                id="project-name"
                class="custom-control"
                v-model="name"
                type="text"
                @keyup.enter="submitted"
            />
            <div
                class="custom-control custom-checkbox"
                data-toggle="tooltip"
                title="The default Boards are: \nBacklog, Todo, In Progress, Waiting, Done"
            >
                <input
                    v-model="createDefaultBoards"
                    class="custom-control-input"
                    type="checkbox"
                    id="defaultBoardsCheck"
                />
                <label class="custom-control-label" for="defaultBoardsCheck">
                    Create Default Boards
                </label>
            </div>
        </template>
    </modal>
</template>

<script lang="ts">
import { Board, Create, Project } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

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
            createDefaultBoards: true
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
            const project = await this.$store.dispatch("addProject", {
                title: this.name
            } as Create<Project>) as Project;

            if (this.createDefaultBoards) {
                await Promise.all(
                    ["Backlog", "Todo", "In Progress", "Waiting", "Done"].map(
                        value =>
                            this.$store.dispatch("addBoard", {
                                title: value,
                                project: project.id,
                            } as Create<Board>)
                    )
                );
            }

            this.name = "";
            this.$emit("finish");
            this.$emit("close");
        }
    }
});
</script>

<style>
</style>