<template>
    <div>
        <div class="container">
            <span class="font-weight-bold p-2">{{ currentDisplayed() }}</span>
            <div class="btn-group" role="group" aria-label="Navigation">
                <button
                    @click.left="navigate(-1)"
                    type="button"
                    class="btn btn-secondary"
                >
                    Previous
                </button>
                <button
                    @click.left="navigate(0)"
                    type="button"
                    class="btn btn-secondary"
                >
                    Current
                </button>
                <button
                    @click.left="navigate(1)"
                    type="button"
                    class="btn btn-secondary"
                >
                    Next
                </button>
            </div>
        </div>
        <div class="calendar container">
            <div class="row">
                <div
                    v-for="weekDay of weekDays"
                    :key="weekDay.index"
                    class="col day-cell bg-white text-center p-1"
                >
                    {{ weekDay.name }}
                </div>
            </div>
            <div
                v-for="week of [0, 1, 2, 3, 4, 5]"
                :key="week"
                class="row week-cell"
            >
                <calendar-day
                    v-for="weekDay of weekDays"
                    :key="weekDay.index"
                    :day="calendar[week][weekDay.index]"
                    :weekEnd="weekDay.weekEnd"
                    :today="today"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import calendarDay from "@/components/calendar-day.vue";
import { defineComponent } from "vue";

enum Navigation {
    Backward = -1,
    Current = 0,
    Forward = 1
}

export default defineComponent({
    components: { calendarDay },
    name: "Calendar",
    data() {
        return {
            current: new Date(),
            today: new Date(),
            weekDays: [
                {
                    index: 0,
                    name: "Monday"
                },
                {
                    index: 1,
                    name: "Tuesday"
                },
                {
                    index: 2,
                    name: "Wednesday"
                },
                {
                    index: 3,
                    name: "Thursday"
                },
                {
                    index: 4,
                    name: "Friday"
                },
                {
                    index: 5,
                    name: "Saturday",
                    weekEnd: true
                },
                {
                    index: 6,
                    name: "Sunday",
                    weekEnd: true
                }
            ]
        };
    },
    computed: {
        calendar(): Array<Array<null | Date>> {
            const calendar: Array<Array<null | Date>> = [];

            for (let week = 0; week < 6; week++) {
                // set the default values for empty days
                calendar[week] = [null, null, null, null, null, null, null];
            }
            const current = new Date(this.current);
            // start from day one
            current.setDate(1);
            let week = 0;
            let previousWeekDay = 0;
            for (
                let currentMonth = current.getMonth();
                currentMonth === current.getMonth();
                current.setDate(current.getDate() + 1)
            ) {
                // set sunday as last day of week
                const weekDay = (current.getDay() + 6) % 7;

                if (previousWeekDay > weekDay) {
                    week++;
                }
                previousWeekDay = weekDay;
                calendar[week][weekDay] = new Date(current);
            }
            return calendar;
        }
    },
    methods: {
        navigate(direction: Navigation) {
            let current = this.current.getMonth();

            if (direction === Navigation.Current) {
                current = new Date().getMonth();
            }

            this.current.setMonth(current + direction);
            this.current = new Date(this.current);
        },
        currentDisplayed() {
            const locale = navigator.languages
                ? navigator.languages[0]
                : navigator.language;
            return this.current.toLocaleDateString(locale, {
                month: "long",
                year: "numeric"
            });
        }
    }
});
</script>

<style>
.calendar .week-cell {
    height: 10em;
}
.calendar .day-cell {
    width: 10em;
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
}
.calendar .day-cell.past {
    background-color: #e8e8e8 !important;
}
.calendar .day-cell.today {
    background-color: cornsilk !important;
}
.calendar .task {
    display: block;
    color: white;
    background-color: #dc3545;
    padding-right: 0.6em;
    padding-left: 0.6em;
    border-radius: 10rem;
}
.calendar .past > .task {
    opacity: 0.5;
}
.calendar .task ~ .task {
    margin-top: 2px;
}
/* For a single Task over its current and parent-sibling days */
/* element {
	width: 230px;
	position: absolute;
	z-index: 1;
} */
</style>