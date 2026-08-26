import styles from "./chat.css?raw";
import { state } from "../../state";

class ChatPage extends HTMLElement {
  currentUserId: string | undefined;
  currentChatID: string | undefined;
  constructor() {
    super();
    this.currentUserId;
  }
  render(shadowRoot: ShadowRoot) {
    shadowRoot.innerHTML = `
    <div class="page-root">
    <section class="content-section">
      <h1 class="content-section__title">Bienvenido</h1>
      <h3 class="subtitle">ID del Chat:</h3>
      <div class="messages-container">
      <c-panel ></c-panel>
      </div>
      <div class="message-form-container">
        <c-form class="message-form" button="Enviar" type="message"></c-form>
        </div>
        </section>
        </div>
        `;
    const h3El = shadowRoot.querySelector(".subtitle");
    state.subscribe(() => {
      const currentState = state.getState();
      this.currentChatID = currentState.currentChat;
      if (h3El != null) {
        h3El.textContent = `ID del Chat: ${this.currentChatID}`;
      }
      return true;
    });

    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    this.render(shadowRoot);
  }
}
customElements.define("chat-page", ChatPage);
