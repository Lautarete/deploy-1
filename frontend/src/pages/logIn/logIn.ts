import { Router } from "@vaadin/router";
import { state } from "../../state";
import styles from "./logIn.css?raw";

class LogInPage extends HTMLElement {
  constructor() {
    super();
  }
  render(shadowRoot: ShadowRoot) {
    shadowRoot.innerHTML = `
      <div class="root-page">
        <h1 class="main-title">Bienvenido</h1>
        <h3 class="sub-title">Inicia sesion con tu email</h3>
        <div class="form-container">
          <form class="form">
            <label class="email-label" for="email">Email</label>
            <input type="text" class="email-input"/>
            <c-button class="submit-button">Iniciar sesion</c-button>
          </form>
        </div>
        <div class="go-to-singup-container">
          <c-button class="go-to-singup-button">O crea tu cuenta aqui</c-button>
        </div>
      </div>
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.render(shadowRoot);

    // <HTMLInputEl> le indica con que clase responderá querySelector(), de esta forma la constante tendra .value
    const emailInputEl =
      shadowRoot.querySelector<HTMLInputElement>(".email-input");
    const submitButtonEl = shadowRoot.querySelector(".submit-button");
    submitButtonEl?.addEventListener("click", () => {
      console.log(emailInputEl?.value);
      // llamar al state para iniciar sesion con este email
      if (typeof emailInputEl?.value == "string") {
        const logInStatus = state.logIn(emailInputEl.value);
        logInStatus.then((res) => {
          if (res >= 200 && res <= 300) {
            console.log("todo salio bien");

            Router.go("/home");
          } else {
            console.log("algo salio mal");
          }
        });
      }
    });

    const singupButtonEl = shadowRoot.querySelector(".go-to-singup-button");
    singupButtonEl?.addEventListener("click", () => {
      Router.go("singup");
    });
  }
}
customElements.define("log-in-page", LogInPage);
