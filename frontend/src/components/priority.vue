<template>
    <i class="fas" :class="classes" />
    <template v-if="displayText">
        {{ priority?.title }}
    </template>
</template>

<script lang="ts">
import { Priority } from "@/client";
import { defineComponent, PropType } from "vue";
export default defineComponent({
    name: "Priority",
    props: {
        priority: { type: Object as PropType<Priority>, required: false },
        displayText: { type: Boolean, default: false }
    },
    computed: {
        classes(): Record<string, boolean> {
            if (!this.priority) {
                return {};
            }
            return {
                "text-primary": this.priority.value < 0,
                "fa-angle-double-down": this.priority.value < -1,
                "fa-angle-down": this.priority.value === -1,
                "text-warning": this.priority.value === 0,
                "fa-minus-circle": this.priority.value === 0,
                "text-danger": this.priority.value > 0,
                "fa-angle-up": this.priority.value === 1,
                "fa-angle-double-up": this.priority.value > 1,
                "mr-1": this.displayText,
                "priority-sm": !this.displayText && this.priority.value === 0
            };
        }
    }
});
</script>

<style scoped>
.priority-sm {
    font-size: 10px;
    vertical-align: middle;
    height: 16px;
}
</style>