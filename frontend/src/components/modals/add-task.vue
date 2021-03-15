<template>
    <modal
        id="add-task-modal"
        :show="show"
        @submit="submitted"
        @close="close"
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
            <div class="form-row">
                <div class="col">
                    <select
                        v-model="project"
                        class="custom-select form-control w-100"
                    >
                        <option selected>Select Project</option>
                        <option
                            v-for="project in $store.state.projects"
                            :key="project.id"
                            :value="project.id"
                            >{{ project.title }}</option
                        >
                    </select>
                </div>
                <div class="col">
                    <select
                        v-model="board"
                        class="custom-select form-control w-100"
                    >
                        <option selected>Select Board</option>
                        <option
                            v-for="board in boards"
                            :key="board.id"
                            :value="board.id"
                            >{{ board.title }}</option
                        >
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <select v-model="parentTask" class="custom-select">
                        <option selected>Select optional Parent Task</option>
                        <option
                            v-for="task in possibleTaskParents"
                            :key="task.id"
                            :value="task.id"
                            >{{ task.title }}</option
                        >
                    </select>
                </div>
                <div class="col">
                    <input
                        class="form-control"
                        v-model="location"
                        type="text"
                        placeholder="Location"
                    />
                </div>
            </div>
            <div class="form-row">
                <span class="my-auto col-form-label col-sm-1">Start</span>
                <div class="col">
                    <input
                        class="form-control"
                        v-model="startDate"
                        type="date"
                    />
                </div>
                <div class="col">
                    <input
                        class="form-control"
                        v-model="startTime"
                        type="time"
                    />
                </div>
            </div>
            <div class="form-row">
                <span class="my-auto col-form-label col-sm-1">Due</span>
                <div class="col">
                    <input class="form-control" v-model="dueDate" type="date" />
                </div>
                <div class="col">
                    <input class="form-control" v-model="dueTime" type="time" />
                </div>
            </div>
            <div class="form-row form-inline">
                <span class="my-auto col-form-label">Remind me:</span>
                <input
                    class="form-control mx-2"
                    style="width: 5em;"
                    v-model.number="reminderValue"
                    type="number"
                />
                <select
                    v-model="reminderUnit"
                    class="custom-select form-control flex-fill"
                >
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
                class="form-control w-100"
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
import { Board, Create, Label, Project, Reminder, Task } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";
import AddLabel from "./add-label.vue";
import { AddTaskModal } from "@/siteTypes";

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
    name: "AddTaskModal",
    emits: ["finish", "close"],
    components: { modal, AddLabel },
    data() {
        let projectId: undefined | number;
        let boardId: undefined | number;

        // webpack did not transpile typeof correctly so check if it is a value
        if (
            this.$store.state.addTaskModal &&
            typeof this.$store.state.addTaskModal === "object"
        ) {
            const value = this.$store.state.addTaskModal as AddTaskModal;

            projectId = value.project;
            boardId = projectId && value.board;
        }

        if (!projectId) {
            projectId = this.$store.getters.getFirstProject?.id;
        }

        if (!boardId && projectId && typeof projectId === "object") {
            boardId = this.$store.getters.getBoards(projectId)[0]?.id;
        }
        return {
            showAddLabel: false,
            name: "",
            project: projectId,
            board: boardId,
            description: "",
            startDate: null as null | any,
            startTime: null as null | any,
            dueDate: null as null | any,
            dueTime: null as null | any,
            location: "",
            submitting: false,
            parentTask: null as null | Task,
            reminderValue: null as null | number,
            reminderUnit: TimeUnit.DAY,
            labels: [] as Label[],
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
        modalValue(): AddTaskModal | null | boolean {
            return this.$store.state.addTaskModal;
        },
        show(): boolean {
            return this.$store.state.addTaskModal !== null;
        },
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
        modalValue() {
            // webpack did not transpile typeof correctly so check if it is a value
            if (this.modalValue && typeof this.modalValue === "object") {
                this.project = this.modalValue.project;
                this.board = this.project && this.modalValue.board;
            } else {
                this.project = this.$store.getters.getFirstProject?.id;

                if (!this.board && this.project) {
                    this.board = this.$store.getters.getBoards(this.project)[0]?.id;
                }
            }
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
        close() {
            this.$emit("close");
            this.$store.commit("setAddTaskModal", null);
        },
        async submitted() {
            if (this.submitting) {
                return;
            }
            this.submitting = true;

            try {
                // TODO: handle error
                const task = (await this.$store.dispatch("addTask", {
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
                } as Create<Task>)) as Task;

                if (
                    this.reminderValue &&
                    Number.isInteger(this.reminderValue) &&
                    this.reminderValue > 0
                ) {
                    const secondsOffset =
                        this.reminderValue * this.reminderUnit;
                    const targetDate = task.due || task.start;

                    if (targetDate) {
                        const date = new Date(targetDate);
                        date.setSeconds(date.getSeconds() - secondsOffset);
                        // TODO: create and post reminder
                        await this.$store.dispatch("addReminder", {
                            task: task.id,
                            when: date
                        } as Create<Reminder>);
                    }
                }

                this.name = "";
                this.description = "";
                this.labels = [];

                this.$emit("finish");
            } finally {
                this.submitting = false;
                this.close();
            }
        }
    }
});
</script>

<style>
#add-task-modal .modal-body > .custom-control,
#add-task-modal .modal-body > .form-row,
#add-task-modal .modal-body > .form-control {
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
}
#add-task-modal .modal-body span.my-auto {
    padding-left: 5px;
    padding-right: 5px;
}
</style>