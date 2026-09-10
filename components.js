/* Emmett Web Components.
   Light DOM only (no Shadow DOM) — they render into their own regular children,
   so tokens.css/styles.css apply directly, same as any other element on the page.
   Dumb/presentational: props in via attributes, events out via CustomEvent.
   No component fetches its own data or reaches into global state — that stays
   at the page level (see index.html / pdp.html), so swapping in real data
   (e.g. a future Storefront API) only ever touches the page, never these files.
*/

// ---------------------------------------------------------------------------
// STATUS: complete — mirrors the Figma "Button" component 1:1.
// ---------------------------------------------------------------------------
class EmmetButton extends HTMLElement {
  static get observedAttributes() {
    return ["size", "state", "label"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const size = this.getAttribute("size") === "large" ? "large" : "compact";
    const state = this.getAttribute("state") === "added" ? "added" : "default";
    const label = this.getAttribute("label") || "Add To Cart";

    this.innerHTML = `<button type="button" class="btn-bag${size === "large" ? " btn-bag--large" : ""}${state === "added" ? " is-added" : ""}">${label}</button>`;

    this.querySelector("button").addEventListener("click", (e) => {
      // preventDefault is the one that actually matters here: an ancestor
      // <a> (Product Card's link) runs its navigation as a native default
      // action tied to the click's original target chain, independent of
      // whether any JS listener along the way ran — stopPropagation alone
      // does NOT cancel that, it only stops other *listeners* from firing.
      // Learned this the hard way: a stopPropagation-only version looked
      // correct in an isolated listener test (no listener fired) while the
      // browser still navigated anyway a task tick later.
      e.preventDefault();
      e.stopPropagation();
      // Fires the event and stops there — it does NOT self-manage the
      // added→revert timing. That's cart business logic, which belongs at
      // the page level (see index.html/pdp.html), not baked into a
      // presentational component.
      this.dispatchEvent(new CustomEvent("add-to-bag", { bubbles: true, composed: true }));
    });
  }
}
customElements.define("emmet-button", EmmetButton);

// ---------------------------------------------------------------------------
// STATUS: complete — mirrors the Figma "Product Card" component 1:1,
// including the Default/Hover text-color states (real CSS :hover, not a
// JS-driven attribute — see .product-card:hover in styles.css). Composes
// <emmet-button>, same as the Figma card composes a real Button instance.
// ---------------------------------------------------------------------------
class EmmetProductCard extends HTMLElement {
  static get observedAttributes() {
    return ["name", "finish", "price", "image", "href", "variant"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") || "";
    const finish = this.getAttribute("finish") || "";
    const price = this.getAttribute("price") || "";
    const image = this.getAttribute("image") || "";
    const href = this.getAttribute("href") || "#";
    // "lifestyle" = editorial/lifestyle photography rather than a plain
    // product pack shot — no border, and name/finish/price/button stay
    // hidden until hover instead of always showing.
    const isLifestyle = this.getAttribute("variant") === "lifestyle";
    const cardClass = `product-card${isLifestyle ? " product-card--lifestyle" : ""}`;

    this.innerHTML = `
      <a href="${href}" class="${cardClass}">
        <div class="card-media"><img src="${image}" alt="${name}, ${finish} finish"></div>
        <div class="card-row card-row--top">
          <p class="card-name">${name}</p>
          <p class="card-finish">${finish}</p>
        </div>
        <div class="card-row card-row--bottom">
          <p class="card-price">${price}</p>
          <emmet-button label="Add To Cart"></emmet-button>
        </div>
      </a>
    `;

    this.querySelector("emmet-button").addEventListener("add-to-bag", (e) => {
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent("add-to-bag", {
          bubbles: true,
          composed: true,
          detail: { name, finish, price, image },
        })
      );
    });
  }
}
customElements.define("emmet-product-card", EmmetProductCard);
// Grid-layout transparency: let the real <a class="product-card"> inside be
// the actual grid item (aspect-ratio, span-2, etc. all already target that
// class), rather than double-boxing it inside the custom element's own box.
const cardStyle = document.createElement("style");
cardStyle.textContent = `emmet-product-card { display: contents; }`;
document.head.appendChild(cardStyle);

// ---------------------------------------------------------------------------
// DRAFTS BELOW — real, working custom elements with a considered attribute/
// event contract, but not yet swapped into index.html/pdp.html in place of
// the current hand-written markup. Treat these as proposals to review, not
// finished, battle-tested components like Button/Product Card above.
// ---------------------------------------------------------------------------

// DRAFT — <emmet-nav>
// Wraps the SHOP/logo/CART header. One variant only, site-wide — transparent
// overlay, used identically on Home and PDP. There used to be a second
// solid/white variant for PDP (site-header--solid); removed in favor of the
// single overlay style everywhere, since the accent pink reads fine against
// both the dark hero/gallery backgrounds and PDP's white details panel.
class EmmetNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
      <header class="site-header">
        <a href="index.html" class="nav-link">Shop</a>
        <span class="site-logo" role="img" aria-label="Emmett">
          <span class="site-logo-svg"></span>
          <span class="liquid-metal liquid-metal--logo" aria-hidden="true"><span class="liquid-metal-spin"></span></span>
        </span>
        <a href="#" class="nav-link" data-cart-link>Cart</a>
      </header>
    `;
    fetch("assets/svg/logo.svg")
      .then((r) => r.text())
      .then((svg) => {
        this.querySelector(".site-logo-svg").innerHTML = svg;
      });
    this.querySelector("[data-cart-link]").addEventListener("click", (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("cart-open", { bubbles: true, composed: true }));
    });
  }
}
customElements.define("emmet-nav", EmmetNav);

// DRAFT — <emmet-footer> (no attributes — content is static site-wide)
class EmmetFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-mark" aria-hidden="true">
          <span class="footer-mark-svg"></span>
          <span class="liquid-metal liquid-metal--symbol" aria-hidden="true"><span class="liquid-metal-spin"></span></span>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">Contact</a>
          <a href="#" class="footer-link">About</a>
          <a href="#" class="footer-link">Legal</a>
          <a href="#" class="footer-link">Social</a>
        </div>
      </footer>
    `;
    fetch("assets/svg/symbol.svg")
      .then((r) => r.text())
      .then((svg) => {
        this.querySelector(".footer-mark-svg").innerHTML = svg;
      });
  }
}
customElements.define("emmet-footer", EmmetFooter);

// DRAFT — <emmet-cart-drawer>
// Proposed fuller cart layout, built on top of the same tokens/patterns as
// the rest of the site (button colors, spacing scale, card border color).
// Adds what the shipped cart.js drawer doesn't have: a quantity stepper and
// remove control per line item, a running subtotal, and a checkout CTA —
// while keeping the same open()/close()/addItem() method surface so it can
// still drop in wherever the plain drawer does today.
class EmmetCartDrawer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="cart-overlay" data-overlay></div>
      <aside class="cart-drawer" data-drawer>
        <div class="cart-drawer-head">
          <span class="cart-title">Cart</span>
          <button class="cart-close" type="button" data-close aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1L15 15M15 1L1 15"/></svg></button>
        </div>
        <p class="cart-empty" data-empty>Your cart is empty.</p>
        <div class="cart-items" data-items style="display:none"></div>
        <div class="cart-summary" data-summary style="display:none">
          <span>Subtotal</span>
          <span data-subtotal></span>
        </div>
        <button type="button" class="cart-checkout-btn" data-checkout style="display:none">Checkout</button>
        <p class="cart-note">Demo storefront — checkout is not connected to any payment or order system.</p>
      </aside>
    `;
    this._items = [];
    this.querySelector("[data-close]").addEventListener("click", () => this.close());
    this.querySelector("[data-overlay]").addEventListener("click", () => this.close());
  }

  open() {
    this.querySelector("[data-drawer]").classList.add("is-open");
    this.querySelector("[data-overlay]").classList.add("is-open");
  }

  close() {
    this.querySelector("[data-drawer]").classList.remove("is-open");
    this.querySelector("[data-overlay]").classList.remove("is-open");
  }

  // Adding the same name+finish again bumps quantity instead of listing a
  // duplicate row — matches how a real cart behaves.
  addItem(item) {
    const existing = this._items.find((it) => it.name === item.name && it.finish === item.finish);
    if (existing) {
      existing.qty += 1;
    } else {
      this._items.push({ ...item, qty: 1 });
    }
    this._render();
  }

  _removeItem(index) {
    this._items.splice(index, 1);
    this._render();
  }

  // No separate remove control — pressing "−" at quantity 1 removes the
  // line item instead of clamping there, so the stepper alone covers both.
  _changeQty(index, delta) {
    const nextQty = this._items[index].qty + delta;
    if (nextQty < 1) {
      this._removeItem(index);
      return;
    }
    this._items[index].qty = nextQty;
    this._render();
  }

  _render() {
    const empty = this.querySelector("[data-empty]");
    const list = this.querySelector("[data-items]");
    const summary = this.querySelector("[data-summary]");
    const checkout = this.querySelector("[data-checkout]");

    const hasItems = this._items.length > 0;
    empty.style.display = hasItems ? "none" : "block";
    list.style.display = hasItems ? "flex" : "none";
    summary.style.display = hasItems ? "flex" : "none";
    checkout.style.display = hasItems ? "flex" : "none";
    if (!hasItems) {
      list.innerHTML = "";
      return;
    }

    list.innerHTML = this._items
      .map(
        (it, i) => `
      <div class="cart-item cart-item--detailed">
        <img src="${it.image}" alt="">
        <div class="cart-item-body">
          <div class="cart-item-top-row">
            <span class="cart-item-name">${it.name}</span>
            <span class="cart-item-price">${it.price}</span>
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

    const subtotal = this._items.reduce((sum, it) => {
      const price = parseFloat(String(it.price).replace(/[^0-9.]/g, ""));
      return sum + price * it.qty;
    }, 0);
    this.querySelector("[data-subtotal]").textContent = `$${subtotal}`;

    list.querySelectorAll("[data-qty-down]").forEach((btn) => {
      btn.addEventListener("click", () => this._changeQty(Number(btn.dataset.qtyDown), -1));
    });
    list.querySelectorAll("[data-qty-up]").forEach((btn) => {
      btn.addEventListener("click", () => this._changeQty(Number(btn.dataset.qtyUp), 1));
    });
  }
}
customElements.define("emmet-cart-drawer", EmmetCartDrawer);

// ---------------------------------------------------------------------------
// STATUS: complete — mirrors the real Figma "Color Picker" component
// (Figma node 23:9, on the real PDP frame 11:1337). This replaces the
// earlier <emmet-finish-select> dropdown draft entirely — the actual design
// turned out to be a pair of always-visible swatches, not a dropdown menu,
// so that draft is gone rather than kept alongside a design that was never
// real. Selected swatch gets a pill (border/radius/padding reuse Button's
// own tokens, same reuse the Figma component itself uses); unselected is a
// bare swatch + label. Swatch fill colors are new tokens — they weren't
// bound to anything before this.
// ---------------------------------------------------------------------------
class EmmetColorPicker extends HTMLElement {
  static get observedAttributes() {
    return ["value", "options"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const value = this.getAttribute("value") || "silver";
    const options = (this.getAttribute("options") || "gold,silver").split(",");
    const label = value.charAt(0).toUpperCase() + value.slice(1);

    this.innerHTML = `
      <div class="color-picker-swatches">
        ${options
          .map(
            (opt) => `
          <button type="button" class="color-picker-swatch-wrap${opt === value ? " is-selected" : ""}" data-value="${opt}" aria-label="${opt.charAt(0).toUpperCase() + opt.slice(1)}">
            <span class="color-picker-swatch" data-finish="${opt}">
              <span class="liquid-metal" aria-hidden="true"><span class="liquid-metal-spin"></span></span>
            </span>
          </button>`
          )
          .join("")}
      </div>
      <span class="color-picker-label">${label}</span>
    `;

    this.querySelectorAll("[data-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setAttribute("value", btn.dataset.value);
        this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value: btn.dataset.value } }));
      });
    });
  }
}
customElements.define("emmet-color-picker", EmmetColorPicker);
const pickerStyle = document.createElement("style");
pickerStyle.textContent = `emmet-color-picker { display: inline-flex; align-items: center; gap: var(--space-300); }`;
document.head.appendChild(pickerStyle);

// DRAFT — <emmet-ticker text="Free shipping on orders above $100">
class EmmetTicker extends HTMLElement {
  static get observedAttributes() {
    return ["text"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const text = this.getAttribute("text") || "";
    const repeats = Array(10).fill(`<span>${text}</span>`).join("");
    this.innerHTML = `<div class="ticker"><div class="ticker-track">${repeats}${repeats}</div></div>`;
  }
}
customElements.define("emmet-ticker", EmmetTicker);

// DRAFT — <emmet-product-gallery images="a.jpg,b.jpg">
// The one component whose CSS genuinely differs by breakpoint (vertical
// stacked-scroll on desktop, horizontal snap-carousel + dots on mobile — see
// the @media (max-width:768px) block in styles.css). Markup is breakpoint-
// agnostic; the media query does the rest, same as the real PDP today.
class EmmetProductGallery extends HTMLElement {
  static get observedAttributes() {
    return ["images"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const images = (this.getAttribute("images") || "").split(",").filter(Boolean);
    this.innerHTML = `
      <div class="pdp-gallery" data-gallery>
        ${images.map((src) => `<img src="${src}" alt="">`).join("")}
      </div>
      <div class="pdp-gallery-dots" data-dots>
        ${images.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}"></span>`).join("")}
      </div>
    `;
    const gallery = this.querySelector("[data-gallery]");
    const dots = this.querySelectorAll("[data-dots] span");
    gallery.addEventListener("scroll", () => {
      const index = Math.round(gallery.scrollLeft / gallery.clientWidth);
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    });
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => gallery.scrollTo({ left: i * gallery.clientWidth, behavior: "smooth" }));
    });
  }
}
customElements.define("emmet-product-gallery", EmmetProductGallery);
