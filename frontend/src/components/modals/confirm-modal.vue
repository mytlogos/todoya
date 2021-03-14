<template>
  <modal :show="show" @submit="onSubmit" @close="onClose">
      <template #title>
          {{ title }}
      </template>
      <template #close>
          No
      </template>
      <template #submit>
          Yes
      </template>
  </modal>
</template>

<script lang="ts">
import modal from "./modal.vue"
import { defineComponent } from "vue"

export default defineComponent({
    name: "ConfirmationModal",
    components: { modal },
    computed: {
        show() {
            return this.$store.state.confirmationModal !== null;
        },
        title() {
            return this.$store.state.confirmationModal?.title;
        }
    },
    methods: {
        onSubmit() {
            this.$store.state.confirmationModal?.onConfirm();
            this.onClose()
        },
        onClose() {
            this.$store.state.confirmationModal?.onChoice();
            this.$store.commit('setConfirmationModal', null);
        }
    }
})
</script>