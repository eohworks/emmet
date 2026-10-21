/* <emmet-color-picker> — the gold/silver finish swatches on the PDP.
   Light DOM only (no Shadow DOM), so tokens.css/styles.css apply directly.
   Presentational: value/options in via attributes, "change" CustomEvent out;
   the page owns the state (see pdp.html).
*/

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
