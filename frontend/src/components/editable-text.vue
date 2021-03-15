<template>
    <template v-if="edit">
        <input
            @blur="submit"
            @submit="submit"
            @keyup.enter.ctrl.stop="submit"
            class="form-control"
            :type="type"
            v-model="value"
        />
    </template>
    <template v-else>
        <span @click="startEdit" role="button" class="pl-1">{{
            modelValue
        }}</span>
    </template>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
export default defineComponent({
    name: "EditableText",
    props: {
        modelValue: { type: String, required: true },
        type: { type: String, default: "text" }
    },
    emits: ["update:modelValue", "submit"],
    data() {
        return {
            edit: false,
            currentValue: this.modelValue
        };
    },
    computed: {
        value: {
            get(): string {
                return this.modelValue;
            },
            set(value: string) {
                this.currentValue = value;
                this.$emit("update:modelValue", value);
            }
        }
    },
    methods: {
        startEdit() {
            this.edit = true;
            nextTick(() => {
                (this.$el as HTMLElement).focus();
            });
        },
        submit() {
            this.$emit("submit", this.currentValue);
            this.edit = false;
        }
    }
});
</script>

<style scoped>
span:hover {
    border: 1px #acacac solid;
    border-radius: 5px;
}
</style>