<template>
    <div class="vh-100 bg-white d-flex flex-column">
        <app-header />
        <router-view class="flex-fill" />
        <modal
            id="notification-modal"
            :show="!$store.state.notificationsSettings.requested"
            @submit="requestPermission"
            @keyup.enter.ctrl="requestPermission"
        >
            <template v-slot:title>
                Allow Notifications
            </template>
        </modal>
        <confirm-modal />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "@/components/app-header.vue";
import Modal from "./components/modals/modal.vue";
import ConfirmModal from "./components/modals/confirm-modal.vue";

export default defineComponent({
    name: "Home",
    components: {
        AppHeader,
        Modal,
        ConfirmModal,
    },
    async created() {
        await this.$store.dispatch("sync");
    },
    methods: {
        requestPermission() {
            if (Notification.permission !== "denied") {
                if (Notification.permission === "granted") {
                    this.$store.commit("notifications", { requested: true });
                } else {
                    Notification.requestPermission().finally(() => {
                        this.$store.commit("notifications", { requested: true });
                    });
                }
            } else {
                this.$store.commit("notifications", { requested: true });
            }
        }
    }
});
</script>
