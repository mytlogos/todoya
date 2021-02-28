<template>
  <div
      ref="modal"
      class="modal fade"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" >
              <slot name="title" />
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click.left="$emit('close')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot name="body" />
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click.left="$emit('close')"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click.left="$emit('submit')"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import $ from "jquery";

export default defineComponent({
    name: "Modal",
    props: {
        show: Boolean
    },
    emits: ["close", "submit"],
    watch: {
        show() {
            console.log("should show");
            if (this.show) {
                $(this.$refs.modal as HTMLElement).modal("show");
            } else {
                $(this.$refs.modal as HTMLElement).modal("hide");
            }
        }
    }
});
</script>
<style scoped>

</style>