const apiUrl = 'https://vue3-course-api.hexschool.io/';
const apiPath = 'carolyang-vue3';

export default {
  props: {
    tempCart: {
      type: Object,
      default() {
        return {};
      },
    },
    isLoading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  template: `
    <div class="modal fade" id="delCartModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="delCartModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-light">
            <h5 class="modal-title fw-bold" id="delCartModalLabel">刪除購物車</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0" v-if="tempCart.id">
              刪除後無法復原，確定要刪除<span class="text-danger fw-bold">{{ tempCart.product.title }}</span>
            </p>
            <p class="mb-0" v-else>
              刪除後無法復原，確定要刪除 <span class="text-danger fw-bold">全部購物車</span>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-outline-danger" @click.prevent="delCart">確定刪除</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      delCartModal: null,
    }
  },
  methods: {
    delCart() {
      let url = `${apiUrl}api/${apiPath}/carts`;

      if (this.tempCart.id) {
        url = `${apiUrl}api/${apiPath}/cart/${this.tempCart.id}`;
      }

      this.$emit('toggleLoading', true);
      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            const message = {
              text: `${this.tempCart.id ? '刪除購物車成功' : '刪除全部購物車成功'}`,
              bg: 'bg-success',
            };
            this.$emit('showToast', message);
            this.$emit('getCarts');
            this.delCartModal.hide();
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.$emit('showToast', message);
          }
          this.$emit('toggleLoading', false);
        })
        .catch(() => {
          const message = {
            text: '刪除購物車失敗',
            bg: 'bg-danger',
          };
          this.$emit('showToast', message);
          this.$emit('toggleLoading', false);
        })
    },
  },
  mounted() {
    this.delCartModal = new bootstrap.Modal(document.getElementById('delCartModal'));
  },
};