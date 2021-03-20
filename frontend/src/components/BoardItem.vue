<template>
    <div
        class="board-task card shadow-sm p-1"
        role="button"
        :class="{ 'task-done': item.completion_date }"
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
            <i
                v-if="item.completion_date"
                class="fas text-success fa-check-circle ml-2"
            />
        </span>
        <div class="content-preview text-black-50 font-weight-bold">
            <i
                v-if="item.description"
                class="fas mr-2 fa-bars"
                title="This task has a Description"
            ></i>
            <span
                v-if="checkListsOverview.total"
                class="mr-2"
                title="This task has a checklist"
            >
                <i class="fa-check-square far mr-1"></i
                >{{ checkListsOverview.checked }}/{{ checkListsOverview.total }}
            </span>
            <span v-if="item.due" class="mr-2" title="This task has a due Date">
                <i class="far mr-1 fa-clock"></i>{{ dueIconLabel }}
            </span>
        </div>
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
        dueIconLabel(): string {
            const date = this.item.due as Date | undefined;
            if (!date) {
                return "";
            }
            return (
                date.toLocaleString("en-us", { month: "long" }) +
                " " +
                date.getDate()
            );
        },
        labels(): Label[] {
            return this.$store.state.labels.filter(label =>
                this.item.labels.includes(label.id)
            );
        },
        priority(): Priority {
            return this.priorityList.find(
                value => value.id === this.item.priority
            ) as Priority;
        },
        checkListsOverview(): any {
            const checkLists = this.$store.state.checkLists[this.item.id] || [];
            const overview = {
                total: 0,
                checked: 0
            };
            checkLists.forEach(list => {
                list.items.forEach(item => {
                    overview.total++;
                    if (item.checked) {
                        overview.checked++;
                    }
                });
            });
            return overview;
        }
    }
});
</script>

<style>
.label-container .badge ~ .badge {
    margin-left: 0.5em;
}
.content-preview {
    font-size: 0.85em;
}
.content-preview > :not(:last-child) {
    margin-right: 0.5rem;
}
.task-done {
    opacity: 0.5;
}
</style>