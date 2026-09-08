// Client-side only cart drawer. Nothing here talks to a server —
// it just tracks a count in memory for the session so "Add To Bag" feels real.
const Cart = (() => {
  let items = [];

  function render() {
    const list = document.getElementById("cartItems");
    const empty = document.getElementById("cartEmpty");
    if (!list || !empty) return;

    if (items.length === 0) {
      empty.style.display = "block";
      list.style.display = "none";
      list.innerHTML = "";
      return;
    }

    empty.style.display = "none";
    list.style.display = "flex";
    list.innerHTML = items
      .map(
        (it) => `
      <div class="cart-item">
        <img src="${it.image}" alt="">
        <div>
          <div class="cart-item-name">${it.name}</div>
          <div class="cart-item-meta">${it.finish} · $${it.price}</div>
        </div>
      </div>`
      )
      .join("");
  }

  function add(item) {
    items.push(item);
    render();
  }

  function open() {
    document.getElementById("cartDrawer").classList.add("is-open");
    document.getElementById("cartOverlay").classList.add("is-open");
  }

  function close() {
    document.getElementById("cartDrawer").classList.remove("is-open");
    document.getElementById("cartOverlay").classList.remove("is-open");
  }

  function init() {
    const cartLink = document.getElementById("cartLink");
    const closeBtn = document.getElementById("cartClose");
    const overlay = document.getElementById("cartOverlay");
    if (cartLink) cartLink.addEventListener("click", (e) => { e.preventDefault(); open(); });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    render();
  }

  return { add, open, close, init };
})();

document.addEventListener("DOMContentLoaded", Cart.init);
