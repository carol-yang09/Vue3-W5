import Loading from '../components/loading.js';
import Toast from '../components/toast.js';
import productModal from '../components/productModal.js';
import DelCartModal from '../components/delCartModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/';
const apiPath = 'carolyang-vue3';

const app = Vue.createApp({
  data() {
    return {
      isLoading: false,
      message: {
        text: '',
        bg: '',
      },
      products: {},
      carts: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      tempCart: {},
      tempProduct: {},
    };
  },
  methods: {
    getProducts() {
      this.isLoading = true;
      axios.get(`${apiUrl}api/${apiPath}/products/all`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.showToast(message);
          }
          this.isLoading = false;
        })
        .catch(() => {
          const message = {
            text: '取得產品列表失敗',
            bg: 'bg-danger',
          };
          this.showToast(message);
          this.isLoading = false;
        })
    },
    getCarts() {
      this.isLoading = true;
      axios.get(`${apiUrl}api/${apiPath}/cart`)
        .then((res) => {
          if (res.data.success) {
            this.carts = res.data.data;
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.showToast(message);
          }
          this.isLoading = false;
        })
        .catch(() => {
          const message = {
            text: '取得購物車失敗',
            bg: 'bg-danger',
          };
          this.showToast(message);
          this.isLoading = false;
        })
    },
    addToCart(item, qty = 1) {
      const data = {
        product_id: item.id,
        qty, 
      }
      this.isLoading = true;
      axios.post(`${apiUrl}api/${apiPath}/cart`, { data })
        .then((res) => {
          if (res.data.success) {
            const message = {
              text: `已將 ${item.title} 加入購物車`,
              bg: 'bg-success',
            };
            this.getCarts();
            this.showToast(message);
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.showToast(message);
          }
          this.isLoading = false;
        })
        .catch(() => {
          const message = {
            text: '加入購物車失敗',
            bg: 'bg-danger',
          };
          this.showToast(message);
          this.isLoading = false;
        })
    },
    updateCartItem(cart, qty) {
      if (qty <= 0) {
        const message = {
          text: '購物車商品數量必須大於 1',
          bg: 'bg-danger',
        };
        this.showToast(message);
        return;
      }
      const data = {
        product_id: cart.id,
        qty,
      };
      this.isLoading = true;
      axios.put(`${apiUrl}api/${apiPath}/cart/${cart.id}`, { data })
        .then((res) => {
          if (res.data.success) {
            const message = {
              text: '更新購物車成功',
              bg: 'bg-success',
            };
            this.showToast(message);
            this.getCarts();
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.showToast(message);
          }
          this.isLoading = false;
        })
        .catch(() => {
          const message = {
            text: '更新購物車失敗',
            bg: 'bg-danger',
          };
          this.showToast(message);
          this.isLoading = false;
        })
    },
    showDelModal(action, cart) {
      if (action == 'delCartItem') {
        this.tempCart = {... cart};
      } else {
        this.tempCart = {};
      }
      this.$refs.delCartModal.delCartModal.show();
    },
    showProductModal(e, productId) {
      if (e.target.nodeName == 'A' || e.target.nodeName == 'SPAN') {
        return;
      }
      this.$refs.productModal.getProduct(productId);
    },
    createOrder() {
      this.isLoading = true;
      axios.post(`${apiUrl}api/${apiPath}/order`, { data: this.form })
        .then((res) => {
          if (res.data.success) {
            const message = {
              text: '建立訂單成功',
              bg: 'bg-success',
            };
            this.showToast(message);
            this.resetOrderForm();
            this.getCarts();
          } else {
            const message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            this.showToast(message);
          }
          this.isLoading = false;
        })
        .catch(() => {
          const message = {
            text: '建立訂單失敗',
            bg: 'bg-danger',
          };
          this.showToast(message);
          this.isLoading = false;
        })
    },
    resetOrderForm() {
      this.form.user.name = '';
      this.form.user.email = '';
      this.form.user.tel = '';
      this.form.user.address = '';
      this.form.message = '';
    },
    toggleLoading(val) {
      this.isLoading = val;
    },
    showToast(msg) {
      this.message = msg;
      this.$refs.toastMessage.toast.show();
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
    },
  },
  components: {
    Loading,
    Toast,
    productModal,
    DelCartModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
})

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');
