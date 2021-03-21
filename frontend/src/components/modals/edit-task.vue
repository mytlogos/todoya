<template>
    <modal
        id="edit-task-modal"
        :show="show"
        @submit="submitted"
        @close="close"
        @keyup.enter.ctrl="submitted"
    >
        <template v-slot:title>
            Edit Task
        </template>
        <template v-slot:body>
            <div class="row">
                <div class="col-sm">
                    <div class="form-row mx-0">
                        <input
                            id="task-name"
                            class="form-control col-sm"
                            v-model="name"
                            type="text"
                            placeholder="Name"
                        />
                        <div class="dropdown">
                            <a
                                class="btn col-auto my-1 btn-default"
                                title="Priority"
                                role="button"
                                id="editPriorityButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <priority
                                    :priority="priority"
                                    :displayText="true"
                                />
                            </a>
                            <div
                                class="dropdown-menu"
                                aria-labelledby="editPriorityButton"
                            >
                                <a
                                    v-for="item in priorityList"
                                    :key="item.id"
                                    class="dropdown-item"
                                    href="#"
                                    @click="priorityId = item.id"
                                    ><priority
                                        :priority="item"
                                        :displayText="true"
                                /></a>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-sm">
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
                        <div class="col-sm">
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
                    <textarea
                        v-model="description"
                        class="form-control w-100"
                        placeholder="Description"
                        rows="5"
                    />
                    <check-list
                        v-for="(checklist, index) in checkLists"
                        :key="checklist.title"
                        v-model="checklist.items"
                        v-model:title="checklist.title"
                        :checkListId="checklist.id"
                        @delete="deleteCheckList(index)"
                    />
                </div>
                <div class="col-sm-3">
                    <div class="form-row mx-auto btn-group w-100">
                        <div class="dropdown d-inline-block flex-fill">
                            <button
                                class="btn btn-secondary dropdown-toggle w-100"
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
                                <li
                                    v-for="label in $store.state.labels"
                                    :key="label"
                                >
                                    <a
                                        class="dropdown-item"
                                        href="#"
                                        @click="addLabel(label)"
                                    >
                                        <span
                                            class="badge"
                                            :style="
                                                `background-color: ${label.color};`
                                            "
                                        >
                                            {{ label.title }}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <i
                            class="btn fas fa-plus bg-secondary text-white"
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
                    <button
                        @click="addCheckList"
                        class="btn btn-secondary form-control d-flex"
                    >
                        <i class="fas fa-plus my-auto mr-2"></i
                        ><span>Checklist</span>
                    </button>
                    <select v-model="parentTask" class="custom-select">
                        <option selected>Select optional Parent Task</option>
                        <option
                            v-for="task in possibleTaskParents"
                            :key="task.id"
                            :value="task.id"
                            >{{ task.title }}</option
                        >
                    </select>
                    <input
                        class="form-control"
                        v-model="location"
                        type="text"
                        placeholder="Location"
                    />
                    <div class="form-row">
                        <span class="my-auto col-form-label col-sm-1"
                            >Start</span
                        >
                        <div class="col-sm">
                            <input
                                class="form-control"
                                v-model="startDate"
                                type="date"
                            />
                        </div>
                        <div class="col-sm">
                            <input
                                class="form-control"
                                v-model="startTime"
                                type="time"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <span class="my-auto col-form-label col-sm-1">Due</span>
                        <div class="col-sm">
                            <input
                                class="form-control"
                                v-model="dueDate"
                                type="date"
                            />
                        </div>
                        <div class="col-sm">
                            <input
                                class="form-control"
                                v-model="dueTime"
                                type="time"
                            />
                        </div>
                    </div>
                    <div class="form-row form-inline">
                        <span class="my-auto col-form-label">Remind me:</span>
                        <input
                            class="form-control col-sm"
                            style="width: 5em;"
                            v-model.number="reminderValue"
                            type="number"
                        />
                        <select
                            v-model="reminderUnit"
                            class="custom-select form-control col-sm"
                        >
                            <option
                                v-for="reminder in possibleReminder"
                                :key="reminder.value"
                                :value="reminder.value"
                                >{{ reminder.name }}</option
                            >
                        </select>
                    </div>
                </div>
            </div>
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
import { Board, CheckItem, CheckList, Label, Priority, Task } from "@/client";
import { defineComponent, nextTick, PropType } from "vue";
import modal from "./modal.vue";
import $ from "jquery";
import AddLabel from "./add-label.vue";
import checkList from "../check-list.vue";
import priority from "../priority.vue";
import { toIsoDateString, toIsoTimeString } from "@/tools";

enum TimeUnit {
    SECOND = 1,
    MINUTE = SECOND * 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    WEEK = 7 * 24,
    MONTH = DAY * 30,
    YEAR = DAY * 365
}

function getCheckLists(getter: any, taskId?: number): CheckList[] {
    if (!taskId) {
        return [];
    }
    // make a deep copy to avoid store pollution
    return getter.getCheckLists(taskId).map((value: CheckList) => ({
        ...value,
        items: value.items.map(item => ({ ...item }))
    }));
}

export default defineComponent({
    name: "EditTaskModal",
    props: {
        show: Boolean,
        taskId: Number
    },
    emits: ["finish", "close"],
    components: { modal, AddLabel, checkList, priority },
    data() {
        const task: Task | undefined = this.$store.getters.getTask(this.taskId);

        return {
            priorityId: task?.priority || 3,
            checkLists: getCheckLists(this.$store.getters, this.taskId),
            showAddLabel: false,
            submitting: false,
            name: task?.title || "",
            project: task?.project,
            board: task?.board,
            description: task?.description || "",
            startDate: null as null | string,
            startTime: null as null | string,
            dueDate: null as null | string,
            dueTime: null as null | string,
            location: task?.location || "",
            parentTask: task?.parent_task as null | Task,
            labels:
                task?.labels.map(labelId => {
                    return this.$store.state.labels.find(
                        label => label.id === labelId
                    ) as Label;
                }) || [],
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
        priority(): Priority {
            return this.$store.getters
                .getPriorities(this.task?.project)
                .find(
                    (value: Priority) => value.id === this.priorityId
                ) as Priority;
        },
        priorityList(): Priority[] {
            return this.$store.getters.getPriorities(this.task?.project);
        },
        storeCheckLists(): CheckList[] {
            return getCheckLists(this.$store.getters, this.taskId);
        },
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
        storeCheckLists() {
            // ensure that the checklists from the store do exist in edit-task
            this.storeCheckLists.forEach(value => {
                if (!this.checkLists.find(current => current.id === value.id)) {
                    this.checkLists.push(value);
                }
            });
        },
        task(task: Task | undefined) {
            this.name = task?.title || "";
            this.project = task?.project;
            this.board = task?.board;
            this.location = task?.location || "";
            this.description = task?.description || "";
            this.parentTask = task?.parent_task as null | Task;
            this.checkLists = getCheckLists(this.$store.getters, this.taskId);
            this.priorityId = task?.priority || 3;
            this.labels =
                task?.labels.map(labelId => {
                    return this.$store.state.labels.find(
                        label => label.id === labelId
                    ) as Label;
                }) || [];

            this.reset("startDate", (task?.start && toIsoDateString(task.start as Date)) || null);
            this.reset("startTime", (task?.start && toIsoTimeString(task.start as Date)) || null);
            this.reset("dueDate", (task?.due && toIsoDateString(task.due as Date)) || null);
            this.reset("dueTime", (task?.due && toIsoTimeString(task.due as Date)) || null);
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
        /**
         * If a time or date input does not have a complete input (only hours but no minutes) then it has no value yet.
         * So setting a new value on property, does not change the input, if the property itself did not change.
         * 
         * If the value differs, it is set immediately.
         * If the new value does not differ from current, it is first set to a default value and 
         * in the next tick to the new value, to purge any incomplete changes in the input element.
         */
        reset(key: "dueDate" | "dueTime" | "startDate" | "startTime", value: string | null) {
            if (this[key] !== value) {
                this[key] = value;
                return;
            }
            if (key === "dueTime" || key === "startTime") {
                if (value === "0:00") {
                    this[key] = "0:01";
                } else {
                    this[key] = "0:00";
                }
            } else {
                this[key] = "0000-01-01";
            }
            nextTick(() => this[key] = value);
        },
        close() {
            this.name = "";
            this.description = "";
            this.labels = [];
            this.checkLists = [];
            this.dueDate = null;
            this.dueTime = null;
            this.startDate = null;
            this.startTime = null;
            this.$emit("close");
        },
        addCheckList() {
            this.checkLists.push({
                id: 0,
                title: "CheckList",
                task: this.taskId as number,
                items: []
            });
            // TODO: create a task after creating a checklist
        },
        deleteCheckList(index: number) {
            this.checkLists.splice(index, 1);
        },
        addLabel(label: Label) {
            if (!this.labels.includes(label)) {
                this.labels.push(label);
            }
        },
        getDate(
            dateString: string | null,
            timeString: string | null
        ): Date | undefined {
            let date;
            try {
                date = new Date(dateString + "T" + timeString);

                if (Number.isNaN(date.getDate())) {
                    return;
                }
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
                    labels: this.labels.map(value => value.id),
                    priority: this.priorityId
                } as Task);

                await this.submitCheckLists();

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

                this.$emit("finish");
                this.$emit("close");
            } finally {
                this.submitting = false;
            }
        },
        async submitCheckLists() {
            const originalCheckLists = this.$store.getters.getCheckLists(
                this.taskId
            ) as CheckList[];

            const newCheckItems = [] as CheckItem[];
            const updatedCheckItems = [] as CheckItem[];
            const removedCheckItems = [] as CheckItem[];

            this.checkLists
                .filter(value => value.id)
                .forEach(checkList => {
                    const original = originalCheckLists.find(
                        value => value.id === checkList.id
                    );

                    if (!original) {
                        console.warn(
                            "Expected to find the checklist in the original: " +
                                JSON.stringify(checkList)
                        );
                        return;
                    }

                    newCheckItems.push(
                        ...checkList.items.filter(value => value.id === 0)
                    );

                    original.items.forEach(originalItem => {
                        const value = checkList.items.find(
                            current => current.id === originalItem.id
                        );

                        if (!value) {
                            removedCheckItems.push(originalItem);
                        } else if (
                            value.title !== originalItem.title ||
                            value.checked !== originalItem.checked
                        ) {
                            updatedCheckItems.push(value);
                        }
                    });
                });

            // create, update, delete check items from existing checklists
            await Promise.all([
                ...newCheckItems.map(value =>
                    this.$store.dispatch("addCheckItem", value)
                ),
                ...updatedCheckItems.map(value =>
                    this.$store.dispatch("updateCheckItem", value)
                ),
                ...removedCheckItems.map(value =>
                    this.$store.dispatch("deleteCheckItem", value)
                )
            ]);

            const newLists = this.checkLists.filter(value => value.id === 0);
            const removedLists = [] as CheckList[];
            const updatedLists = [] as CheckList[];

            originalCheckLists.forEach(original => {
                const value = this.checkLists.find(
                    current => current.id === original.id
                );
                if (!value) {
                    removedLists.push(original);
                } else if (value.title !== original.title) {
                    updatedLists.push(value);
                }
            });
            // create, update, delete check lists
            await Promise.all([
                ...newLists.map(value =>
                    this.$store.dispatch("addCheckList", value)
                ),
                ...updatedLists.map(value =>
                    this.$store.dispatch("updateCheckList", value)
                ),
                ...removedLists.map(value =>
                    this.$store.dispatch("deleteCheckList", value)
                )
            ]);
        }
    }
});
</script>

<style>
#edit-task-modal .modal-body .btn-default {
    border-color: #ced4da;
    margin-left: 10px;
}
#edit-task-modal .modal-body .custom-control,
#edit-task-modal .modal-body .form-row,
#edit-task-modal .modal-body .form-control {
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
}
#edit-task-modal .modal-body span.my-auto {
    padding-left: 5px;
    padding-right: 5px;
}
#edit-task-modal .modal-body .form-control[type="date"],
#edit-task-modal .modal-body .form-control[type="time"] {
    min-width: 150px;
}
#edit-task-modal .modal-body .btn-group .dropdown:first-child .btn {
    border-radius: 0.25rem 0 0 0.25rem;
}
#edit-task-modal .modal-body .btn-group .dropdown ~ .btn {
    max-width: 40px;
    border-radius: 0 0.25rem 0.25rem 0;
    align-content: center;
    display: grid;
    border-left: 1px #acacac solid;
}
@media (min-width: 750px) {
    #edit-task-modal > .modal-dialog {
        max-width: 700px;
    }
}
</style>