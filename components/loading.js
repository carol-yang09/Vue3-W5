export default {
  props: {
    isLoading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  template: `
    <div class="loading-wrap" v-if="isLoading">
      <div class="loading">
        <div class="sk-grid">
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
          <div class="sk-grid-cube"></div>
        </div>
      </div>
    </div>
  `,
}