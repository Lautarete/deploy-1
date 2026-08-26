import styles from "./message.css?raw";

export function initMessageComp() {
  class MessageCustomElement extends HTMLElement {
    constructor() {
      super();
    }
    render(shadowRoot: ShadowRoot) {
      // attribute "is" = send / receive
      shadowRoot.innerHTML = `
          <!-- if is="receive" this label doesn´t show -->
          <label class="${this.getAttribute("class")}">${this.getAttribute("user-name")}</label>
          <div class="message-container ${this.getAttribute("class")}">
            <label class="text">${this.textContent}</label>
          </div>
        `;

      const styleEl = document.createElement("style");
      styleEl.textContent = styles;
      shadowRoot.appendChild(styleEl);
    }
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });
      this.render(shadowRoot);
    }
  }
  customElements.define("c-message", MessageCustomElement);
}
