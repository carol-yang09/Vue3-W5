export default {
  props: {
    message: {
      type: Object,
      default() {
        return {
        };
      },
    },
  },
  template: `
    <div class="message">
      <div id="tostMessage" class="toast text-white" :class="message.bg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          <div class="d-flex align-items-center">
            <p class="m-0">{{ message.text }}</p>
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      toast: null,
    };
  },
  mounted() {
    this.toast = new bootstrap.Toast(document.getElementById('tostMessage'));
  },
}