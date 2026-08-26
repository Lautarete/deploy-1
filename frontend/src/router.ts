import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "log-in-page" },
  { path: "/login", component: "log-in-page" },
  { path: "/singup", component: "sing-up-page" },
  { path: "/home", component: "home-page" },
  { path: "/chat", component: "chat-page" },
]);
// console.log("this is router");

// crear las pages
// importarlas desde index.ts, no hace falta que las pages impoten nada. Entiendo que importarlas desde index.ts las ejecuta y permite que puedan ser usadas
// importar el ruter desde index.ts
// importar Router desde cada pagina donde se quiere cambiar de pagina, Router.go("path") cambia de pantalla, deberia ir en el boton para cambiar de pantalla
