<template>
    <div
        ref="root"
        :class="{
            'text-danger': weekEnd,
            past: isPast,
            today: isToday
        }"
        class="col day-cell bg-white"
    >
        <span class="font-weight-bold">{{ dayOfMonth }}</span>
        <div
            v-for="task of tasksOfDay"
            :key="task.id"
            class="task text-truncate"
            data-toggle="tooltip"
            data-html="true"
            :title="tooltip(task)"
        >
            {{ task.title }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Task } from "@/client";
import $ from "jquery";

export default defineComponent({
    name: "CalendarDay",
    props: {
        day: { type: Date, required: false },
        weekEnd: Boolean,
        today: { type: Date, required: true }
    },
    mounted() {
        $(this.$refs.root as HTMLElement).tooltip({
            html: true,
            selector: ".task[data-toggle=tooltip]"
        });
    },
    computed: {
        dayOfMonth(): null | number {
            const value = this.day;
            if (!value) {
                return null;
            }
            return value.getDate();
        },
        isPast(): boolean {
            const value = this.day;
            // check if earlier day
            return (
                !value ||
                value.toISOString().substring(0, 10) <
                    this.today.toISOString().substring(0, 10)
            );
        },
        isToday(): boolean {
            const value = this.day;
            // check if earlier day
            return (
                !!value && value.toDateString() === this.today.toDateString()
            );
        },
        tasksOfDay(): Task[] {
            const value = this.day;
            if (!value) {
                return [];
            }
            const date = value.toDateString();
            return this.$store.state.tasks.filter(task => {
                return (
                    (task.start instanceof Date &&
                        task.start.toDateString() === date) ||
                    (task.due instanceof Date &&
                        task.due.toDateString() === date)
                );
            });
        }
    },
    methods: {
        tooltip(task: Task): string {
            return `
            <h5>${task.title}</h5>
            <div>
                Project: ${this.$store.getters.getProject(task.project)?.title}
            </div>
            <div>
                Board: ${this.$store.getters.getBoard(task.project)?.title}
            </div>
            <div>
                Start: ${task.start ? task.start.toLocaleString() : ''}
            </div>
            <div>
                Due: ${task.due ? task.due.toLocaleString() : ''}
            </div>
            <div>
                Description: 
                <p class="">${task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '')}</p>
            </div>
            `;
        }
    }
});
</script>
<style>
.tooltip-inner {
    text-align: left;
    background-color: #308c59;
}
</style>