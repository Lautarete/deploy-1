import { ref, get, onValue } from "firebase/database";
import { dataBase } from "./db";
import { subscribe } from "firebase/data-connect";

type Message = {
  // sender es number o string?
  sender: string;
  text: string;
  // timestamp: number;
};

type State = {
  // currenChat ahora va a ser el CUID

  currentChat: string | undefined;
  currentUserName: string | undefined;
  currentUserId: string | undefined;
  // Record<> se trata de un objeto cuyas claves y valores estan dentro
  messages: null | Record<string, Message>;
};

export const state = {
  data: {
    // tanto el chat como el user no van a cambiar mientras se este corriendo la aplicacion, tenerlos guardados aca facilita todo mucho
    currentChat: undefined,
    currentUserName: undefined,
    currentUserId: undefined,
    messages: {},
  } as State,
  listeners: [
    function iteratingListeners() {
      console.log("Listeners Working");
      return;
    },
  ],
  getState() {
    return this.data;
  },
  setState(newState: any) {
    console.log(newState);
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
  },
  subscribe(callback: () => {}) {
    this.listeners.push(callback);
  },
  subscribeToRTDB() {
    // escucha a la RTDB y cambia el estado cada vez que hay un cambio
    const currentState = this.getState();
    const theRealId = this.getChatId(currentState.currentChat!);

    //  como me subscribo?
    theRealId.then((res) => {
      const messagesRef = ref(dataBase, "/chat-desafio/messages/" + res.chatId);

      // onValue se subscribe a la db
      onValue(messagesRef, (snapshot) => {
        console.log("subscribiendose a RTDB");

        const newMessagesData = snapshot.val();
        // newMessagesData son solo los mensajes

        this.setState({ ...this.data, messages: newMessagesData });
      });
    });
  },
  apiBaseURL: "http://localhost:3001",
  // crear todo lo que permite hacer el backend
  createNewMessage(messageText: string) {
    // crear un mensaje con los usuarios de prueba
    // se deberian recivir los IDs de algun lado
    const currentData = this.getState();
    this.getChatId(currentData.currentChat!).then((res) => {
      const realChatId = res.chatId;
      fetch(
        this.apiBaseURL +
          "/messages/" +
          realChatId +
          "/" +
          currentData.currentUserName,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: messageText,
          }),
        },
      ).then((res) => {
        console.log(res);
      });
    });
  },
  // metodos a crear

  createNewUser(email: string, name: string) {
    // crea un usuario usando la api
    const newUserStatus = fetch(this.apiBaseURL + "/singup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
      }),
    }).then((res) => {
      console.log(res.status);
      return res.status;
    });

    return newUserStatus;
  },

  logIn(email: string) {
    // recibe un email, chequea que exista
    // si existe .userId entonces si existe el usuario
    const authFetch = fetch(this.apiBaseURL + "/auth", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    authFetch
      .then((res) => {
        // console.log(res.status);

        return res.json();
      })
      .then((data) => {
        // hay que hacer esto con un setState()?????
        // si, el cambio de pagina es inmediato
        // primero se cambia de pagina, y luego, en home, se recibe la data
        this.setState({
          ...this.data,
          currentUserId: data.userId,
          currentUserName: data.userName,
        });
      });
    return authFetch.then((res) => {
      return res.status;
    });
  },

  createNewChat() {
    // crea un chat usando la api
    fetch(this.apiBaseURL + "/rooms", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      console.log("create chat status: " + res.status);

      res.json().then((data) => {
        this.setState({
          ...this.data,
          currentChat: data.newChatId,
        });
        console.log(
          "currentChat desdepues de crear el chat",
          this.data.currentChat,
        );

        this.subscribeToRTDB();
      });
    });
  },

  getChatId(CUId: string) {
    // recibe un CUID, usa la api para obtener el chatId y conectarse a los mensajes de la rtdb del chat
    const currentState = this.getState();
    const urlReal =
      this.apiBaseURL +
      "/rooms/" +
      CUId +
      "/?userId=" +
      currentState.currentUserId;

    return fetch(urlReal, {
      method: "get",
    }).then((res) => {
      return res.json().then((data) => {
        console.log("get chat id:", data);

        if (data.Error) {
          console.log(data);
        } else {
          return data;
        }
      });
    });
  },
};
