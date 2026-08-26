import styles from "./form.css?raw";
import { state } from "../../state";

export function initFormComp() {
  class FormCustomElement extends HTMLElement {
    constructor() {
      super();
    }
    render(shadowRoot: ShadowRoot) {
      // input name="name or message"
      shadowRoot.innerHTML = `
        <label>${this.getAttribute("label") || ""}</label>
        <input type="text" name=${this.getAttribute("type")}>
        <c-button>${this.getAttribute("button")}</c-button>
        `;

      const styleEl = document.createElement("style");
      styleEl.textContent = styles;
      shadowRoot.appendChild(styleEl);

      const inputEl = shadowRoot.querySelector("input");
      shadowRoot.querySelector("c-button")?.addEventListener("click", () => {
        if (inputEl?.value != undefined && inputEl.value != "") {
          state.createNewMessage(inputEl?.value);
        } else {
          console.log("no se escribio texto para el mensaje");
        }
      });
    }
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });
      this.render(shadowRoot);
    }
  }
  customElements.define("c-form", FormCustomElement);
}
