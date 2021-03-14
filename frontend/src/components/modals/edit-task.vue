<template>
    <modal
        id="edit-task-modal"
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
                class="form-control"
                v-model="name"
                type="text"
                placeholder="Name"
            />
            <div>
                <div class="dropdown d-inline-block">
                    <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownPushTaskLabelMenu"
                        data-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Label
                    </button>
                    <ul
                        class="dropdown-menu"
                        aria-labelledby="dropdownPushTaskLabelMenu"
                    >
                        <li v-for="label in $store.state.labels" :key="label">
                            <a
                                class="dropdown-item"
                                href="#"
                                @click="addLabel(label)"
                            >
                                <span
                                    class="badge"
                                    :style="`background-color: ${label.color};`"
                                >
                                    {{ label.title }}
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
                <i
                    class="btn fas fa-plus bg-danger text-white"
                    style="font-size: 1.5em; margin-left: 0.2em"
                    @click="showAddLabel = true"
                />
                <div class="label-container">
                    <span
                        v-for="label in labels"
                        :key="label"
                        :style="
                            `background-color: ${label.color}; font-size: 100%;`
                        "
                        class="badge"
                        >{{ label.title }}</span
                    >
                </div>
            </div>
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
                /><input class="custom-control" v-model="dueTime" type="time" />
            </div>
            <div class="form-row form-inline mx-0 my-2">
                <label style="margin-right: 0.5em;">Remind me:</label>
                <input
                    class="custom-control"
                    style="width: 5em;"
                    v-model.number="reminderValue"
                    type="number"
                />
                <select v-model="reminderUnit" class="custom-select">
                    <option
                        v-for="reminder in possibleReminder"
                        :key="reminder.value"
                        :value="reminder.value"
                        >{{ reminder.name }}</option
                    >
                </select>
            </div>
            <textarea
                v-model="description"
                class="custom-control w-100"
                placeholder="Description"
                rows="5"
            />
        </template>
    </modal>
    <teleport to="body">
        <add-label
            :show="showAddLabel"
            @close="showAddLabel = false"
            @finish="addLabel($event)"
        />
    </teleport>
</template>

<script lang="ts">
import { Board, Label, Task } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";
import AddLabel from "./add-label.vue";

enum TimeUnit {
    SECOND = 1,
    MINUTE = SECOND * 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    WEEK = 7 * 24,
    MONTH = DAY * 30,
    YEAR = DAY * 365
}

export default defineComponent({
    name: "EditTaskModal",
    props: {
        show: Boolean,
        taskId: Number
    },
    emits: ["finish", "close"],
    components: { modal, AddLabel },
    data() {
        const task: Task | undefined = this.$store.getters.getTask(this.taskId);

        return {
            showAddLabel: false,
            submitting: false,
            name: task?.title || "",
            project: task?.project,
            board: task?.board,
            description: task?.description || "",
            startDate: null as null | any,
            startTime: null as null | any,
            dueDate: null as null | any,
            dueTime: null as null | any,
            location: task?.location || "",
            parentTask: task?.parent_task as null | Task,
            labels: [] as Label[],
            reminderValue: null as null | number,
            reminderUnit: TimeUnit.DAY,
            possibleReminder: [
                {
                    name: "Week before",
                    value: TimeUnit.WEEK
                },
                {
                    name: "Day before",
                    value: TimeUnit.DAY
                },
                {
                    name: "Hour before",
                    value: TimeUnit.HOUR
                },
                {
                    name: "Minute before",
                    value: TimeUnit.MINUTE
                }
            ]
        };
    },
    computed: {
        boards(): Board[] {
            return this.$store.getters.getBoards(this.project);
        },
        possibleTaskParents(): Task[] {
            return this.$store.getters.getProjectTasks(this.project);
        },
        task(): Task | undefined {
            return this.$store.getters.getTask(this.taskId) as Task | undefined;
        }
    },
    mounted() {
        $("#add-task-modal").on("shown.bs.modal", () =>
            $("#task-name").trigger("focus")
        );
    },
    watch: {
        task(task) {
            this.name = task?.title || "";
            this.project = task?.project;
            this.board = task?.board;
            this.location = task?.location || "";
            this.description = task?.description || "";
            this.parentTask = task?.parent_task as null | Task;
        },
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
        }
    },
    methods: {
        addLabel(label: Label) {
            if (!this.labels.includes(label)) {
                this.labels.push(label);
            }
        },
        getDate(dateString: string, timeString: string): Date | undefined {
            let date;
            try {
                date = new Date(dateString + "T" + timeString);
            } catch {
                // invalid string are not reported to user
                console.log(
                    `Invalid Date or Timestring: '${dateString}','${timeString}'`
                );
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
                await this.$store.dispatch("updateTask", {
                    id: this.taskId,
                    title: this.name,
                    project: this.project,
                    board: this.board,
                    description: this.description,
                    start: this.getDate(this.startDate, this.startTime),
                    due: this.getDate(this.dueDate, this.dueTime),
                    location: this.location,
                    parent_task: this.parentTask?.id,
                    categories: [],
                    labels: this.labels.map(value => value.id)
                } as Task);

                // TODO: update reminder
                // if (
                //     this.reminderValue &&
                //     Number.isInteger(this.reminderValue) &&
                //     this.reminderValue > 0
                // ) {
                //     const secondsOffset =
                //         this.reminderValue * this.reminderUnit;
                //     const targetDate = task.due || task.start;

                //     if (targetDate) {
                //         const date = new Date(targetDate);
                //         date.setSeconds(date.getSeconds() - secondsOffset);
                //         // TODO: create and post reminder
                //         await this.$store.dispatch("addReminder", {
                //             task: task.id,
                //             when: date
                //         } as Create<Reminder>);
                //     }
                // }

                this.name = "";
                this.description = "";

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