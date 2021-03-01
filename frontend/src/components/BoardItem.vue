<template>
    <div class="card">
        <div class="card-block">
            <h5 class="card-title">
                <span class="text-muted">#{{ item.id }}</span> {{ item.title }}
            </h5>
        </div>
    </div>
</template>

<script lang="ts">
import { Task } from "@/client";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "BoardItem",
    props: {
        item: Object as PropType<Task>
    }
});
</script>

<style>
</style>