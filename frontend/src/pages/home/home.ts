import { Router } from "@vaadin/router";
import { state } from "../../state";
import styles from "./home.css?raw";

class HomePage extends HTMLElement {
  selectEl: HTMLSelectElement | undefined | null;
  chatIdInputEl: HTMLInputElement | undefined | null;
  constructor() {
    super();
    this.selectEl = undefined;
    this.chatIdInputEl = undefined;
  }
  render(shadowRoot: ShadowRoot) {
    shadowRoot.innerHTML = `
      <div class="root-page">
        <h1 class="main-title">Bienvenido</h1>
        <div class="form-container">
          <form class="form">
            <label class="rooms-label" for="rooms">Chat</label>
            <select name="rooms" class="room-select">
              <option value="new">Nuevo Chat</option>
              <option value="exist">Chat existente</option>
            </select>
            <div class="chatid-input-container">
              <label class="chatid-label" for="chatid">Id del Chat</label>
              <input type="text" class="chatid-input" placeholder="1234" />
            </div>
            <c-button class="submit-button">Comenzar</c-button>
          </form>
        </div>
      </div>
        `;

    const chatIdContEl = shadowRoot.querySelector<HTMLElement>(
      ".chatid-input-container",
    );
    this.chatIdInputEl =
      shadowRoot.querySelector<HTMLInputElement>(".chatid-input");
    this.selectEl = shadowRoot.querySelector("select");
    this.selectEl?.addEventListener("change", () => {
      if (this.selectEl!.value === "exist" && chatIdContEl != null) {
        chatIdContEl.style.display = "block";
      } else if (this.selectEl!.value === "new" && chatIdContEl != null) {
        chatIdContEl.style.display = "none";
      }
    });

    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render(shadowRoot);

    // setTimeout(() => {
    //   console.log(state.getState());
    // }, 5000);

    const submitButtonEl = shadowRoot.querySelector(".submit-button");
    submitButtonEl?.addEventListener("click", () => {
      const chatOption = this.selectEl?.value;
      const newChatId = this.chatIdInputEl?.value;
      // console.log({
      //   chatOption,
      //   newChatId,
      // });

      // aca puede ser createNewChat() o enterChat()
      if (chatOption == "new") {
        state.createNewChat();
        // createNewChat settea el chatId del state y se susbcribe
        Router.go("/chat");
      } else if (chatOption == "exist" && newChatId != "") {
        state.setState({
          ...state.getState(),
          currentChat: newChatId,
        });
        Router.go("/chat");

        state.subscribeToRTDB();
      } else if (newChatId == "") {
        console.log("please enter chat ID");
      }
    });
  }
}
customElements.define("home-page", HomePage);
