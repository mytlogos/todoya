<template>
    <div class="checklist py-2">
        <div class="d-flex justify-content-between">
            <editable-text v-model="titleModel" class="my-auto" />
            <button @click="$emit('delete')" class="btn btn-secondary">
                Remove
            </button>
        </div>
        <div>
            <div class="progress">
                <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: progress }"
                    :aria-valuenow="progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
        <div
            v-for="(task, index) in modelValue"
            :key="task.title"
            @click.self="startTaskEdit(index)"
            class="d-flex task check-task p-1 rounded"
        >
            <input
                :checked="task.checked"
                @input="setTaskCheck(index, $event)"
                type="checkbox"
                class="form-check"
            />
            <editable-text
                :ref="'task-title-' + index"
                :modelValue="task.title"
                @submit="updateTaskTitle(index, $event)"
                class="ml-1 mr-auto my-auto"
                >{{ task.title }}</editable-text
            >
            <i
                @click="removeTask(index)"
                class="fas btn text-danger fa-trash btn-light"
            />
        </div>
        <div>
            <button class="btn btn-secondary" @click="addTask">Add Item</button>
        </div>
    </div>
</template>

<script lang="ts">
import { CheckItem } from "@/client";
import { defineComponent, nextTick, PropType } from "vue";
import editableText from "./editable-text.vue";

export default defineComponent({
    components: { editableText },
    name: "CheckList",
    props: {
        modelValue: {
            type: Array as PropType<CheckItem[]>,
            required: true
        },
        title: { type: String, required: true },
        checkListId: { type: Number, required: true }
    },
    emits: ["update:modelValue", "update:title", "delete"],
    computed: {
        progress(): string {
            const totalLength = this.modelValue.length;
            if (!totalLength) {
                return "0%";
            }
            return (
                (this.modelValue.filter(value => value.checked).length /
                    totalLength) *
                    100 +
                "%"
            );
        },
        titleModel: {
            get(): string {
                return this.title;
            },
            set(value: string) {
                this.$emit("update:title", value);
            }
        }
    },
    methods: {
        setTaskCheck(index: number, event: InputEvent) {
            console.log(event);
            const copy = [...this.modelValue];
            const task = copy[index];
            copy[index] = {
                ...task,
                checked: (event.target as HTMLInputElement).checked
            };
            this.$emit("update:modelValue", copy);
        },
        addTask() {
            const newIndex = this.modelValue.length;
            const copy = [...this.modelValue];
            copy.push({
                id: 0,
                title: "",
                checked: false,
                list: this.checkListId
            });
            this.$emit("update:modelValue", copy);

            nextTick(() => this.startTaskEdit(newIndex));
        },
        updateTaskTitle(index: number, title: string) {
            const copy = [...this.modelValue];
            const task = copy[index];
            copy[index] = { ...task, title };
            this.$emit("update:modelValue", copy);
        },
        removeTask(index: number) {
            const copy = [...this.modelValue];
            copy.splice(index, 1);
            this.$emit("update:modelValue", copy);
        },
        startTaskEdit(index: number) {
            const editableText = this.$refs["task-title-" + index] as
                | any
                | undefined;

            if (!editableText) {
                console.error("Expected Ref to index " + index, this.$refs);
            } else {
                editableText.startEdit();
            }
        }
    }
});
</script>

<style scoped>
.check-task {
    transition: 0.25s ease;
}
.check-task:hover {
    background-color: #acacac;
}
.checklist > * {
    margin-top: 0.5rem;
}
</style>