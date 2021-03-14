<template>
    <vue-draggable v-model="boards" , item-key="position" group="board">
        <template #item="{element}">
            <task-lane :board="element" class="col-md" />
        </template>
    </vue-draggable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskLane from "@/components/task-lane.vue";
import { Board } from "@/client";
import VueDraggable from "vuedraggable";

export default defineComponent({
    name: "ProjectBoard",
    components: { TaskLane, VueDraggable },
    props: {
        id: Number
    },
    computed: {
        /**
         * Get the boards sorted by position.
         */
        boards: {
            get(): Board[] {
                return this.$store.getters
                    .getBoards(this.id)
                    .sort((a: Board, b: Board) => a.position - b.position);
            },
            set(boards: Board[]) {
                // update board positions
                Promise.all(boards.map((board, index) => {
                    if (board.position !== index) {
                        return this.$store.dispatch("updateBoard", {...board, position: index});
                    } else {
                        return Promise.resolve();
                    }
                })).catch(console.error);
            }
        },
    }
});
</script>

<style>
</style>