<template>
    <ul v-if="show" :style="style" class="context-menu list-group list-group-flush">
        <li
            v-for="item in items"
            :key="item.title"
            @click.left="onClick(item)"
            class="list-group-item list-group-item-action"
            role="button"
        >
            {{ item.title }}
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface ContextMenuItem {
    title: string;
    onClick: Function;
}

export default defineComponent({
    name: "ContextMenu",
    emits: ["close"],
    props: {
        startX: Number,
        startY: Number,
        show: Boolean,
        items: Array as PropType<ContextMenuItem[]>,
    },
    computed: {
        style(): any {
            console.log("left and top: ", this.startX, this.startY)
            return {
                top: this.startY + "px",
                left: this.startX + "px",
            };
        }
    },
    mounted() {
        document.addEventListener("click", ev => {
            const root = this.$el as HTMLElement;
            let parent = ev.target as HTMLElement | null;;
            let withinBoundaries = false;

            while(parent) {
                if (parent === root) {
                    withinBoundaries = true;
                    break;
                }
                parent = parent.parentElement;
            }
            if (!withinBoundaries) {
                this.$emit("close");
            }
        });
    },
    methods: {
        onClick(item: ContextMenuItem) {
            item.onClick();
            this.$emit("close");
        },
    },
});
</script>

<style scoped>
.context-menu {
    position: absolute;
    border: 1px black solid;
    z-index: 10;
    width: 15em;
}
</style>