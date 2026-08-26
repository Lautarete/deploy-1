import { initButtonComp } from "./components/button/button";
import { initFormComp } from "./components/form/form";
import { initPanelComp } from "./components/message-panel/panel";
import { initMessageComp } from "./components/message/message";
import { state } from "./state";

import "./pages/logIn/logIn";
import "./pages/singUp/singUp";
import "./pages/home/home";
import "./pages/chat/chat";
import "./router";

function main() {
  // console.log("Hi, i´m main function");

  initButtonComp();
  initFormComp();
  initMessageComp();
  initPanelComp();
  // cuando arranca la aplicacion se debe cargar la info una primera vez en el state y se tienen que correr los callbacks, ver como funciona la rtdb
  // initState() cambio su forma de funcionar: ahora se necesita datos para subscribirse a la RTDB, por ello la funcion ahora debe ejecutarse una vez se tienen todos los datos requeridos
  // state.initState();
}

main();
