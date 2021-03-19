<template>
    <div
        class="board-task card shadow-sm p-1"
        role="button"
        @click="$store.commit('editTask', item.id)"
    >
        <div class="label-container">
            <span
                v-for="label in labels"
                :key="label"
                :style="`background-color: ${label.color};`"
                class="badge"
            >
                {{ label.title }}
            </span>
        </div>
        <span class="card-title">
            <priority :priority="priority" />
            {{ item.title }}
        </span>
    </div>
</template>

<script lang="ts">
import { Label, Task, Priority } from "@/client";
import { defineComponent, PropType } from "vue";
import priority from "./priority.vue";

export default defineComponent({
    components: { priority },
    name: "BoardItem",
    props: {
        item: {
            type: Object as PropType<Task>,
            required: true
        },
        priorityList: {
            type: Array as PropType<Priority[]>,
            required: true
        }
    },
    computed: {
        labels(): Label[] {
            return this.$store.state.labels.filter(label =>
                this.item.labels.includes(label.id)
            );
        },
        priority(): Priority {
            return this.priorityList.find(
                value => value.id === this.item.priority
            ) as Priority;
        }
    }
});
</script>

<style>
.label-container .badge ~ .badge {
    margin-left: 0.5em;
}
</style>