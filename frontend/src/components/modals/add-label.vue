<template>
    <modal
        id="add-label-modal"
        :show="show"
        @submit="submitted"
        @close="$emit('close')"
        @keyup.enter.ctrl="submitted"
    >
        <template v-slot:title>
            Add Label
        </template>
        <template v-slot:body>
            <input
                id="label-name"
                class="custom-control"
                v-model="name"
                type="text"
                @keyup.enter="submitted"
            />
            <input v-model="color" type="color" />
        </template>
    </modal>
</template>

<script lang="ts">
import { Create, Label } from "@/client";
import { defineComponent } from "vue";
import modal from "./modal.vue";
import $ from "jquery";

export default defineComponent({
    name: "AddLabelModal",
    props: {
        show: Boolean
    },
    emits: ["finish", "close"],
    components: { modal },
    data() {
        const project = this.$store.getters.getFirstProject;
        return {
            name: "",
            // for now gray is default
            color: "#eeeeee",
        };
    },
    mounted() {
        $("#add-label-modal").on("shown.bs.modal", () =>
            $("#label-name").trigger("focus")
        );
    },
    methods: {
        async submitted() {
            // TODO: handle error
            const label = await this.$store.dispatch("addLabel", {
                title: this.name,
                color: this.color
            } as Create<Label>);

            this.name = "";

            this.$emit("finish", label);
            this.$emit("close");
        }
    }
});
</script>

<style>
</style>