import styles from "./button.css?raw";

export function initButtonComp() {
  class ButtonCustomElement extends HTMLElement {
    constructor() {
      super();
    }
    render(shadowRoot: ShadowRoot) {
      const styleEl = document.createElement("style");
      styleEl.textContent = styles;
      shadowRoot.appendChild(styleEl);

      const buttonEl = document.createElement("button");
      buttonEl.textContent = this.textContent;
      shadowRoot.appendChild(buttonEl);
    }
    connectedCallback() {
      // creo que este callback escucha eventos
      const shadowRoot = this.attachShadow({ mode: "open" });
      this.render(shadowRoot);
    }
  }
  customElements.define("c-button", ButtonCustomElement);
}
