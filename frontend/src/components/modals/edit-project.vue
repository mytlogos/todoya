<template>
    <modal
        id="edit-project-modal"
        :show="show"
        @submit="submitted"
        @close="close"
        @keyup.enter.ctrl="submitted"
    >
        <template v-slot:title>
            Edit Project
        </template>
        <template v-slot:body>
            <input
                id="project-name"
                class="form-control"
                v-model="name"
                type="text"
                @keyup.enter="submitted"
            />
        </template>
        <template v-slot:footer="{ close, submit }">
            <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                @click.left="deleteProject(close)"
            >
                Delete
            </button>
            <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                @click.left="close()"
            >
                Close
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click.left="submit()"
            >
                Save
            </button>
        </template>
    </modal>
</template>

<script lang="ts">
import { Project } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

export default defineComponent({
    name: "EditProjectModal",
    emits: ["finish", "close"],
    components: { modal },
    data() {
        return {
            name: ""
        };
    },
    computed: {
        show(): boolean {
            return this.$store.state.editProjectModal !== null;
        },
        project(): Project | undefined {
            return this.$store.state.projects.find(
                value => value.id === this.$store.state.editProjectModal
            );
        }
    },
    watch: {
        project(newValue?: Project) {
            this.name = newValue?.title || "";
        }
    },
    mounted() {
        $("#edit-project-modal").on("shown.bs.modal", () =>
            $("#project-name").trigger("focus")
        );
    },
    methods: {
        close() {
            this.$store.commit("setEditProjectModal", null);
            this.$emit('close');
        },
        async deleteProject(close: () => void) {
            await this.$store.dispatch("deleteProject", this.project);
            close();
        },
        async submitted() {
            // TODO: handle error
            await this.$store.dispatch("updateProject", {
                ...this.project,
                title: this.name
            } as Project);

            this.name = "";
            this.$emit("finish");
            this.close();
        }
    }
});
</script>

<style>
</style>