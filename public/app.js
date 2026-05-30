const state = {
  counter: 0,
  cart: [],
  theme: 'light',
};

const heroStatus = document.getElementById('hero-status');
const counterValue = document.getElementById('counter-value');
const cartEmpty = document.getElementById('cart-empty');
const cartItems = document.getElementById('cart-items');
const clearCartBtn = document.getElementById('clear-cart');
const toast = document.getElementById('toast');
const modalBackdrop = document.getElementById('welcome-modal-backdrop');
const formResult = document.getElementById('form-result');

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function openModal() {
  modalBackdrop.hidden = false;
  modalBackdrop.classList.add('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modalBackdrop.classList.remove('is-open');
  modalBackdrop.hidden = true;
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

function renderCounter() {
  counterValue.textContent = String(state.counter);
}

function renderCart() {
  const hasItems = state.cart.length > 0;
  cartEmpty.hidden = hasItems;
  cartItems.hidden = !hasItems;
  clearCartBtn.hidden = !hasItems;

  cartItems.innerHTML = state.cart
    .map((item) => `<li data-testid="cart-item">${item}</li>`)
    .join('');
}

function scrollToSection(name) {
  const section = document.querySelector(`[data-section="${name}"]`);
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('cta-start').addEventListener('click', () => {
  heroStatus.textContent = '很好！你已经点击了「开始探索」，页面会滚到商品区。';
  scrollToSection('products');
  showToast('已跳转到商品区');
});

document.getElementById('cta-modal').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-confirm').addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
    closeModal();
  }
});

document.getElementById('counter-plus').addEventListener('click', () => {
  state.counter += 1;
  renderCounter();
});

document.getElementById('counter-minus').addEventListener('click', () => {
  state.counter = Math.max(0, state.counter - 1);
  renderCounter();
});

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    state.cart.push(product);
    renderCart();
    showToast(`${product} 已加入购物车`);
  });
});

clearCartBtn.addEventListener('click', () => {
  state.cart = [];
  renderCart();
  showToast('购物车已清空');
});

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get('name');
  formResult.hidden = false;
  formResult.textContent = `感谢 ${name}！我们已收到你的消息（本地 demo，不会真的发送）。`;
  showToast('表单提交成功');
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('theme-dark', state.theme === 'dark');
  document.getElementById('theme-toggle').textContent =
    state.theme === 'dark' ? '☀️ 浅色模式' : '🌙 深色模式';
  showToast(state.theme === 'dark' ? '已切换到深色模式' : '已切换到浅色模式');
});

document.querySelectorAll('.nav-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    scrollToSection(button.dataset.nav);
  });
});

renderCounter();
renderCart();
