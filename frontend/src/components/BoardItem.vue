<template>
    <div class="card">
        <div class="card-block">
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
            <h5 class="card-title">
                <span class="text-muted">#{{ item.id }}</span> {{ item.title }}
            </h5>
        </div>
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
</style>