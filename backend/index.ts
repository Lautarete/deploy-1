import express, { response } from "express";
import cors from "cors";

import "dotenv/config";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
// import serviceAccount from "./key.json";

function runAPI() {
  const server = express();
  const PORT = 3001;
  // esto es para poder usar json
  server.use(express.json());
  server.use(cors());

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    } as ServiceAccount),
    databaseURL: "https://apx-00-default-rtdb.firebaseio.com",
  });
  const db = getDatabase();
  const firestore = getFirestore();

  const firestoreUsersRef = firestore.collection("users");

  server.get("/", (request, response) => {
    response.send("No se pidió nada desde GET");
  });

  // MESSAGES

  server.get("/messages", (request, response) => {
    response.send("Especificar un chatID");
  });

  server.get("/messages/:chatID", (request, response) => {
    // responder con todos los mensajes de un chat
    response.send("Mensajes del chat: " + request.params.chatID);
  });

  server.post("/messages/:chatID/:userName", (request, response) => {
    // enviar nuevo mensaje en un chat especifico
    // aca se deberia chequear que tanto el user como el chat existan
    console.log(request.body);
    console.log(request.body.text);

    const messagesRef = db.ref(
      "chat-desafio/messages/" + request.params.chatID,
    );
    messagesRef.push({
      sender: request.params.userName,
      text: request.body.text,
    });

    // esto deberia ser un status "salio todo bien"
    response.send(
      "Enviando mensaje al chat: " +
        request.params.chatID +
        " del usuario: " +
        request.params.userName,
    );
  });

  // USERS

  server.post("/singup", (request, response) => {
    // crear nuevo user
    const id = Math.random().toString().slice(2);

    // en principio aca deberia llegar el body bien si o si, igualmente se chequea
    // chequear que no exista un usuario con el mismo email

    if (request.body.email && request.body.name) {
      const userQuery = firestoreUsersRef.where(
        "email",
        "==",
        request.body.email,
      );

      userQuery.get().then((userSnap) => {
        if (userSnap.empty) {
          const newUserRef = firestoreUsersRef.doc();
          newUserRef.set(request.body);

          response.send({
            newUserId: id,
          });
        } else {
          response.status(400);
          response.send({
            status: "Email has already a user account",
          });
        }
      });
    } else {
      response.status(400);
      response.send({
        status: "Missing email or name in body",
      });
    }
  });

  server.post("/auth", (request, response) => {
    // responder el userId segun el email correspondiente
    // firestoreUsersRef es una referencia a una collection
    // lo que se obtiene de hacerle .get() es una consulta de instantanea, querySnapshot, dentro de las snapshots estan los docs
    // docs siempre sera un iterable
    if (request.body.email) {
      const userQuery = firestoreUsersRef.where(
        "email",
        "==",
        request.body.email,
      );

      userQuery.get().then((userSnap) => {
        if (userSnap.empty) {
          response.status(404);
          response.send({
            Error: "User not found",
          });
        } else {
          // aca hay que enviar el id

          response.send({
            userId: userSnap.docs[0].id,
            userName: userSnap.docs[0].data().name,
          });
        }
        // como solo deberia existir uno, se toma el primero
      });
    } else {
      response.status(400);
      response.send({
        Error: "Missing email or name in body",
      });
    }
  });

  // CHAT

  server.post("/rooms", (request, response) => {
    // crear nuevo chat

    const chatId = Math.random().toString().slice(2);
    const CUId = Math.random().toString().slice(2, 6);

    // En este caso no hace falta guardar que users estan en que chat. Eso tendria mas sentido si se tubieran que imprimir todos los chats en los que se pueden entrar. Tipo WhatsApp. O si se quisiera mostrar que persona entró al chat, quienes o cuantas personas hay.

    // esta es una referencia, solo eso, una ruta. Se va a crear ese espacio en la RTDB cuando se use ese espacio.
    // db.ref("chat-desafio/messages/" + chatId);

    const firestoreNewChatRef = firestore.collection("chats/").doc(CUId);
    firestoreNewChatRef.set({
      chatId,
    });

    response.send({
      newChatId: CUId,
    });
  });

  server.get("/rooms/:CUId", (request, response) => {
    // responder el chat con el id correspondiente

    const { userId } = request.query;
    const { CUId } = request.params;

    const firestoreChatRef = firestore.collection("chats/").doc(CUId);

    // chequear que el user exista
    console.log(userId);

    if (typeof userId == "string") {
      firestore
        .collection("users")
        .doc(userId)
        .get()
        .then((userSnap) => {
          if (userSnap.exists) {
            firestoreChatRef.get().then((chatSnap) => {
              if (chatSnap.exists) {
                response.send({
                  chatId: chatSnap.data()!.chatId,
                });
              } else {
                response.status(404);
                response.send({
                  Error: "No chat room has been find",
                });
              }
            });
          } else {
            response.status(400);
            response.send({
              Error: "User doesn´t exist",
            });
          }
        });
    } else {
      response.status(400);
      response.send({
        Error: "User ID isn´t a string",
      });
    }
  });

  server.listen(PORT, () => {
    console.log(`Escuchando servidor en el puerto ${PORT}`);
  });
}
runAPI();
