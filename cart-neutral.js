// Client-side only cart drawer. Nothing here talks to a server —
// it just tracks a count in memory for the session so "Add To Cart" feels real.
//
// Neutral theme only — a copy of cart.js (same file-per-variant pattern as
// index.html/index-color.html) with the updated row design ported over
// from the Draft EmmetCartDrawer component (components.js/components.html):
// bigger square thumbnail, name+price on one row, finish+swatch dot, and a
// real quantity stepper (adding the same item twice now bumps its qty
// instead of duplicating the row; "−" at qty 1 removes the line). Other
// pages (index-color.html, pdp-color.html, Branch) keep loading the
// original plain cart.js unchanged.
const Cart = (() => {
  let items = []; // each: {name, finish, price, image, qty}

  function render() {
    const cartLink = document.getElementById("cartLink");
    if (cartLink) {
      const count = items.reduce((sum, it) => sum + it.qty, 0);
      cartLink.innerHTML = count > 0 ? `Cart<span class="cart-count">(${count})</span>` : "Cart";
    }

    const list = document.getElementById("cartItems");
    const empty = document.getElementById("cartEmpty");
    const summary = document.getElementById("cartSummary");
    const subtotalEl = document.getElementById("cartSubtotal");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");
    if (!list || !empty) return;

    const hasItems = items.length > 0;
    empty.style.display = hasItems ? "none" : "block";
    list.style.display = hasItems ? "flex" : "none";
    if (summary) summary.style.display = hasItems ? "flex" : "none";
    if (checkoutBtn) checkoutBtn.style.display = hasItems ? "flex" : "none";

    if (!hasItems) {
      list.innerHTML = "";
      return;
    }

    if (subtotalEl) {
      const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
      subtotalEl.textContent = `$${subtotal}`;
    }

    list.innerHTML = items
      .map(
        (it, i) => `
      <div class="cart-item cart-item--detailed">
        <img src="${it.image}" alt="">
        <div class="cart-item-body">
          <div class="cart-item-top-row">
            <span class="cart-item-name">${it.name}</span>
            <span class="cart-item-price">$${it.price}</span>
          </div>
          <div class="cart-item-finish-row">
            <span class="cart-item-finish">${it.finish}</span>
            <span class="cart-item-swatch" data-finish="${it.finish.toLowerCase()}"></span>
          </div>
          <div class="cart-qty">
            <span class="cart-qty-label">QTY</span>
            <button type="button" class="cart-qty-btn" data-qty-down="${i}" aria-label="${it.qty === 1 ? `Remove ${it.name}` : "Decrease quantity"}">&minus;</button>
            <span class="cart-qty-value">${it.qty}</span>
            <button type="button" class="cart-qty-btn" data-qty-up="${i}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-qty-down]").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(Number(btn.dataset.qtyDown), -1));
    });
    list.querySelectorAll("[data-qty-up]").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(Number(btn.dataset.qtyUp), 1));
    });
  }

  // No separate remove control — pressing "−" at quantity 1 removes the
  // item, so the stepper alone covers both, same as the Draft component.
  function changeQty(index, delta) {
    const nextQty = items[index].qty + delta;
    if (nextQty < 1) {
      items.splice(index, 1);
    } else {
      items[index].qty = nextQty;
    }
    render();
  }

  function add(item) {
    const existing = items.find((it) => it.name === item.name && it.finish === item.finish);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
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
