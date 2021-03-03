<template>
    <modal
        id="add-task-modal"
        :show="show"
        @submit="submitted"
        @close="$emit('close')"
        @keyup.enter.ctrl="submitted"
    >
        <template v-slot:title>
            Add Task
        </template>
        <template v-slot:body>
            <input
                id="task-name"
                class="custom-control"
                v-model="name"
                type="text"
                placeholder="Name"
            />
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
            <input
                class="custom-control"
                v-model="location"
                type="text"
                placeholder="Location"
            />
            <select v-model="parentTask" class="custom-select">
                <option selected>Select optional Parent Task</option>
                <option
                    v-for="task in possibleTaskParents"
                    :key="task.id"
                    :value="task.id"
                    >{{ task.title }}</option
                >
            </select>
            <div class="form-row mx-0">
                <input
                    class="custom-control"
                    v-model="startDate"
                    type="date"
                /><input
                    class="custom-control"
                    v-model="startTime"
                    type="time"
                />
            </div>
            <div class="form-row mx-0 my-2">
                <input
                    class="custom-control"
                    v-model="dueDate"
                    type="date"
                /><input
                    class="custom-control"
                    v-model="dueTime"
                    type="time"
                />
            </div>
            <textarea
                v-model="description"
                class="custom-control"
                placeholder="Description"
                rows="5"
            />
        </template>
    </modal>
</template>

<script lang="ts">
import { Board, Create, Task } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

export default defineComponent({
    name: "AddTaskModal",
    props: {
        show: Boolean
    },
    emits: ["finish", "close"],
    components: { modal },
    data() {
        const project = this.$store.getters.getFirstProject;
        const board = project
            ? this.$store.getters.getBoards(project.id)[0]
            : null;
        return {
            name: "",
            project: project?.id || (null as null | number),
            board: board?.id || (null as null | number),
            description: "",
            startDate: null as null | any,
            startTime: null as null | any,
            dueDate: null as null | any,
            dueTime: null as null | any,
            location: "",
            submitting: false,
            parentTask: null as null | Task,
        };
    },
    computed: {
        boards(): Board[] {
            return this.$store.getters.getBoards(this.project);
        },
        possibleTaskParents(): Task[] {
            return this.$store.getters.getProjectTasks(this.project);
        }
    },
    mounted() {
        $("#add-task-modal").on("shown.bs.modal", () =>
            $("#task-name").trigger("focus")
        );
    },
    watch: {
        startDate() {
            // automatically set time to 0:00 if not set yet
            if (this.startDate && !this.startTime) {
                this.startTime = "0:00";
            }
        },
        dueDate() {
            // automatically set time to 0:00 if not set yet
            if (this.dueDate && !this.dueTime) {
                this.dueTime = "0:00";
            }
        },
    },
    methods: {
        getDate(dateString: string, timeString: string): Date | undefined {
            let date;
            try {
                date = new Date(dateString + "T" + timeString);
            } catch {
                // invalid string are not reported to user
                console.log(`Invalid Date or Timestring: '${dateString}','${timeString}'`);
            }
            return date;
        },
        async submitted() {
            if (this.submitting) {
                return;
            }
            this.submitting = true;

            try {
                // TODO: handle error
                await this.$store.dispatch("addTask", {
                    title: this.name,
                    project: this.project,
                    board: this.board,
                    description: this.description,
                    start: this.getDate(this.startDate, this.startTime),
                    due: this.getDate(this.dueDate, this.dueTime),
                    location: this.location,
                    parent_task: this.parentTask?.id,
                } as Create<Task>);

                this.name = "";

                this.$emit("finish");
                this.$emit("close");
            } finally {
                this.submitting = false;
            }
        }
    }
});
</script>

<style>
</style>