import { Router } from "@vaadin/router";
import styles from "./singUp.css?raw";
import { state } from "../../state";

class SingUpPage extends HTMLElement {
  constructor() {
    super();
  }
  render(shadowRoot: ShadowRoot) {
    shadowRoot.innerHTML = `
      <div class="root-page">
        <h1 class="main-title">Crea tu cuenta</h1>
        <div class="form-container">
          <form class="form">
            <label class="email-label" for="email">Email</label>
            <input type="text" class="email-input" />
            <label class="name-label" for="name">Nombre</label>
            <input type="text" class="name-input" />
            <c-button class="submit-button">Crear cuenta</c-button>
          </form>
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

    const emailInputEl =
      shadowRoot.querySelector<HTMLInputElement>(".email-input");
    const nameInputEl =
      shadowRoot.querySelector<HTMLInputElement>(".name-input");
    const submitButtonEl = shadowRoot.querySelector(".submit-button");
    submitButtonEl?.addEventListener("click", () => {
      // console.log(emailInputEl?.value);
      // console.log(nameInputEl?.value);

      // llamar al state para iniciar sesion con este email
      // chequear que los datos coincidan y sean correctos
      if (emailInputEl?.value != "" && nameInputEl?.value != "") {
        const newUserStatus = state.createNewUser(
          emailInputEl?.value!,
          nameInputEl?.value!,
        );

        newUserStatus.then((res) => {
          if (res >= 200 && res <= 300) {
            console.log("salio todo bien creando el usuario");
            Router.go("/login");
          } else {
            console.log("algo salio mal");
          }
        });
      }
    });
  }
}
customElements.define("sing-up-page", SingUpPage);
