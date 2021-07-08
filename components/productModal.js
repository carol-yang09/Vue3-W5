const apiUrl = 'https://vue3-course-api.hexschool.io/';
const apiPath = 'carolyang-vue3';

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
    <div class="modal fade" id="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title fw-bold" id="productLabel">{{ product.title }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-lg-6">
                <img class="img-fluid" :src="product.imageUrl">
              </div>
              <div class="col-12 col-lg-6">
                <h4 class="d-inline-block py-1 px-3 bg-secondary text-light rounded-pill h6">{{ product.category }}</h4>
                <h3 class="mb-3">{{ product.title }}</h3>
                <div class="mb-3" v-if="product.origin_price != product.price">
                  <p class="card-text mb-2 me-4 h5">現在只要
                    <span class="text-danger fw-bold">{{ product.price }} </span>
                    元
                  </p>
                  <p class="card-text mb-0"><del>原價： {{ product.origin_price }} 元</del></p>
                </div>
                <p class="card-text mb-3 h5" v-else>售價： {{ product.origin_price }} 元</p>
                <div class="row">
                  <div class="col-6">
                    <div class="input-group">
                      <a href="#" class="btn btn-sm btn-secondary" type="button" @click.prevent="updateQty(qty-1)">
                        <span class="material-icons align-middle">
                          remove
                        </span>
                      </a>
                      <input type="number" class="form-control bg-white text-center" v-model="qty" min="1" readonly>
                      <a href="#" class="btn btn-sm btn-secondary" type="button" @click.prevent="updateQty(qty+1)">
                        <span class="material-icons align-middle">
                          add
                        </span>
                      </a>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-grid gap-2">
                      <button class="btn btn-dark" type="button" @click.prevent="$emit('addToCart', product, qty)">加入購物車</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      productModal: null,
      product: {},
      qty: 1,
    };
  },
  methods: {
    getProduct(id) {
      this.$emit('toggleLoading', true);
      this.qty = 1;
      axios.get(`${apiUrl}api/${apiPath}/product/${id}`)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product;
            this.productModal.show();
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
            text: `取得產品失敗`,
            bg: 'bg-danger',
          };
          this.$emit('showToast', message);
          this.$emit('toggleLoading', false);
        })
    },
    updateQty(num) {
      if (num <= 0) {
        const message = {
          text:'數量不得小於 0',
          bg: 'bg-danger',
        };
        this.$emit('showToast', message);
        return;
      }
      this.qty = num;
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(document.getElementById('productModal'));
  }
}
