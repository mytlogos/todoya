<template>
    <div class="board-task card shadow-sm p-1">
        <div class="label-container">
            <span
                v-for="label in labels"
                :key="label"
                :style="
                    `background-color: ${label.color};`
                "
                class="badge"
                >{{ label.title }}</span
            >
        </div>
        <span class="card-title">{{ item.title }}</span>
    </div>
</template>

<script lang="ts">
import { Label, Task } from "@/client";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "BoardItem",
    props: {
        item: {
            type: Object as PropType<Task>,
            required: true
        }
    },
    computed: {
        labels(): Label[] {
            return this.$store.state.labels.filter(label => this.item.labels.includes(label.id))
        },
    }
});
</script>

<style>
.label-container .badge ~ .badge {
	margin-left: 0.5em;
}
</style>