<template>
    <div class="d-flex">
        <div class="left-sidebar">
            <div class="m-2">Views</div>
            <ul class="list-group list-group-flush">
                <router-link
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    :to="{ name: 'ListView', query: { view: 0 } }"
                    tag="a"
                    >Today
                    <span class="badge badge-primary badge-pill">{{
                        todayCount
                    }}</span>
                </router-link>
                <router-link
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    :to="{ name: 'ListView', query: { view: 1 } }"
                    tag="a"
                    >Tomorrow
                    <span class="badge badge-primary badge-pill">{{
                        tomorrowCount
                    }}</span>
                </router-link>
                <router-link
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    :to="{ name: 'ListView', query: { view: 2 } }"
                    tag="a"
                    >Next Week
                    <span class="badge badge-primary badge-pill">{{
                        nextWeekCount
                    }}</span>
                </router-link>
                <router-link
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    :to="{ name: 'ListView', query: { view: 3 } }"
                    tag="a"
                >
                    All
                    <span class="badge badge-primary badge-pill">{{
                        allCount
                    }}</span>
                </router-link>
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'Calendar' }"
                    tag="a"
                    >Calendar</router-link
                >
                <router-link
                    class="list-group-item list-group-item-action"
                    :to="{ name: 'Board' }"
                    tag="a"
                    >Board</router-link
                >
            </ul>
            <div class="m-2">Projects</div>
            <ul class="list-group list-group-flush">
                <a
                    v-for="project in projects"
                    :key="project.id"
                    :class="{ active: selectedProjects.includes(project.id) }"
                    :aria-current="
                        selectedProjects.includes(project.id) ? 'true' : 'false'
                    "
                    @click.left.prevent="toggle(project, $event)"
                    href="#"
                    class="list-group-item list-group-item-action"
                >
                    {{ project.title }}
                </a>
            </ul>
        </div>
        <div class="bg-light flex-fill">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { Project, Task } from "@/client";
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
    name: "Home",
    data() {
        return {
            selectedView: "",
            todayCount: 0,
            tomorrowCount: 0,
            nextWeekCount: 0,
            allCount: 0
        };
    },
    computed: {
        ...mapState(["projects", "selectedProjects", "tasks"])
    },
    watch: {
        tasks(tasks: Task[]) {
            // after midnight today
            const afterToday = new Date();
            afterToday.setHours(0, 0, 0, 0);

            // before midnight tomorrow
            const beforeToday = new Date(afterToday);
            beforeToday.setDate(beforeToday.getDate() + 1);
            // after midnight tomorrow
            const afterTomorrow = new Date();
            afterTomorrow.setDate(afterTomorrow.getDate() + 1);
            afterTomorrow.setHours(0, 0, 0, 0);

            // before midnight the day after tomorrow
            const beforeTomorrow = new Date(afterTomorrow);
            beforeTomorrow.setDate(beforeTomorrow.getDate() + 1);
            // after midnight today
            const afterNextWeek = new Date();
            afterNextWeek.setHours(0, 0, 0, 0);

            // before midnight in seven days
            const beforeNextWeek = new Date(afterNextWeek);
            beforeNextWeek.setDate(beforeNextWeek.getDate() + 7);

            this.allCount = tasks.length;
            let todayCount = 0;
            let tomorrowCount = 0;
            let nextWeekCount = 0;

            tasks.forEach(task => {
                if (this.withinTimeBoundary(afterToday, beforeToday, task)) {
                    todayCount++;
                    nextWeekCount++;
                } else if (
                    this.withinTimeBoundary(afterTomorrow, beforeTomorrow, task)
                ) {
                    tomorrowCount++;
                    nextWeekCount++;
                } else if (
                    this.withinTimeBoundary(afterNextWeek, beforeNextWeek, task)
                ) {
                    nextWeekCount++;
                }
            });

            this.todayCount = todayCount;
            this.tomorrowCount = tomorrowCount;
            this.nextWeekCount = nextWeekCount;
        }
    },
    methods: {
        toggle(project: Project, event: MouseEvent) {
            this.$store.commit("toggleProjectSelect", {
                project,
                multi: event.ctrlKey
            });
        },
        withinTimeBoundary(after: Date, before: Date, task: Task) {
            return (
                ((task.start && task.start > after) ||
                    (task.due && task.due > after)) &&
                ((task.start && task.start < before) ||
                    (task.due && task.due < before))
            );
        }
    }
});
</script>
<style>
.left-sidebar {
    border-right: 5px solid rgba(0, 0, 0, 0.1);
    width: 10vw;
    overflow-y: auto;
    min-width: 10em;
    height: calc(
        100vh - 60px
    ); /* take 100% of viewport height minus the nav header */
}
</style>
