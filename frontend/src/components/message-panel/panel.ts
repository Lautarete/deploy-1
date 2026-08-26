import styles from "./panel.css?raw";
import { state } from "../../state";

export function initPanelComp() {
  class PanelCustomElement extends HTMLElement {
    constructor() {
      super();
      state.subscribe(() => {
        this.replaceChildren();
        // ver de donde obtener esto
        const currentState = state.getState();
        const currentUserName = currentState.currentUserName;
        // siempre que se usa <slot> se appendea asi
        const currentChatMessages = currentState.messages;

        if (currentChatMessages != null) {
          for (const [key, value] of Object.entries(currentChatMessages)) {
            const sendOrReceive =
              currentUserName === value.sender ? "send" : "receive";
            console.log(value.text);

            const messageEl = document.createElement("c-message");
            messageEl.textContent = value.text;
            messageEl.classList.add(sendOrReceive);
            messageEl.setAttribute("user-name", value.sender);
            this.appendChild(messageEl);
          }
        }

        return true;
      });
    }
    render(shadowRoot: ShadowRoot) {
      shadowRoot.innerHTML = `
            <div class="container">
              <slot></slot>
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
  customElements.define("c-panel", PanelCustomElement);
}
