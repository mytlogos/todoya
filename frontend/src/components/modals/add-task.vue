<template>
    <modal :show="show" @submit="submitted" @close="$emit('close')">
        <template v-slot:title>
            Add Task
        </template>
        <template v-slot:body>
            <input class="custom-control" v-model="name" type="text" @keyup.enter="submitted" />
            <select v-model="project" class="custom-select">
                <option selected>Select Project of Task</option>
                <option
                    v-for="project in $store.state.projects"
                    :key="project.id"
                    :value="project.id"
                    >{{ project.title }}</option
                >
            </select>
            <select v-model="board" class="custom-select">
                <option selected>Select Initial Board of Task</option>
                <option
                    v-for="board in boards"
                    :key="board.id"
                    :value="board.id"
                    >{{ board.title }}</option
                >
            </select>
        </template>
    </modal>
</template>

<script lang="ts">
import { Board, Create, Task } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";

export default defineComponent({
    name: "AddTaskModal",
    props: {
        show: Boolean
    },
    emits: ["finish", "close"],
    components: { modal },
    data() {
        const project = this.$store.getters.getFirstProject;
        const board = project ? this.$store.getters.getBoards(project.id)[0] : null;
        return {
            name: "",
            project: project?.id || null as null | number,
            board: board?.id || null as null | number
        };
    },
    computed: {
        boards(): Board[] {
            return this.$store.getters.getBoards(this.project);
        }
    },
    watch: {
        show() {
            const root = this.$el as HTMLElement;
            console.log("should focus", root, this.show);

            if (!root) {
                return;
            }
            if (this.show) {
                const input = root.querySelector("input");
                input?.focus();
                console.log("should focus", input);
            }
        },
    },
    methods: {
        async submitted() {
            // TODO: handle error
            await this.$store.dispatch("addTask", {
                title: this.name,
                project: this.project,
                board: this.board,
            } as Create<Task>);

            this.name = "";

            this.$emit("finish");
            this.$emit("close");
        }
    }
});
</script>

<style>
</style>