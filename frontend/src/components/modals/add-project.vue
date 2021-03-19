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
import { Board, Create, PriorityList, Project } from "@/client";
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
            const project = (await this.$store.dispatch("addProject", {
                title: this.name
            } as Create<Project>)) as Project;

            (await this.$store.dispatch("addPriorityList", {
                title: "Default",
                items: [
                    {
                        title: "Very Low",
                        value: -2,
                        id: 1
                    },
                    {
                        title: "Low",
                        value: -1,
                        id: 2
                    },
                    {
                        title: "Medium",
                        value: 0,
                        id: 3
                    },
                    {
                        title: "High",
                        value: 1,
                        id: 4
                    },
                    {
                        title: "Very High",
                        value: 2,
                        id: 5
                    }
                ],
                project: project.id,
                default: 3
            } as Create<PriorityList>)) as Project;

            if (this.createDefaultBoards) {
                await Promise.all(
                    ["Backlog", "Todo", "In Progress", "Waiting", "Done"].map(
                        value =>
                            this.$store.dispatch("addBoard", {
                                title: value,
                                project: project.id
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