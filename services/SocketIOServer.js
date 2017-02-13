"use strict";

const express = require("express");

const io = require("socket.io");
const ioJwt = require("socketio-jwt");

const User = require("../models/User")
const Room = require("../models/Room")

const routes = require("../config/socket-routes");

class WebSocketServer {

  constructor() {
    this.server = undefined;
  }

  updateUser(values, id) {
    return User.updateById({ online: false }, id);
  }

  start() {
    const app = express();
    const port = process.env.WEBSOCKET_PORT || 8008;
    const server = app.listen(port);
    this.server = io(server);
    console.log("SocketIO server started at " + port)

    const self = this;
    this.server.sockets
      .on("connection", ioJwt.authorize({
        secret: process.env.TOKEN_SECRET,
        audience: "login",
        timeout: 15000 // 15 seconds to send the authentication message
      }))
      .on("authenticated", (socket) => {
        console.log("hello! " + socket.decoded_token.user.fullname);
        // User.updateById({ online: false }, socket.decoded_token.user._id)
        // .then((s) => {
        //   console.log("adsads", s)
        // })
        // console.log(socket)

        User.findUserRooms(socket.decoded_token.user._id)
        .then(rooms => {
          rooms.forEach(room => {
            socket.join(`room/${room._id}`)
          })
        })

        const user = socket.decoded_token.user;
        if (user.role === "admin") {
          socket.join(user.role)
        }
        socket.join(`user/${user._id}`);
        socket.join("all");
      });

    this.server.on("connection", (socket) => {
      console.log("Connection to client established");
      // User.updateById({ online: true }, socket.decoded_token.user._id)
      // .then(() => {})

      // passes the socket and reference to the broadcast method for controllers to use
      socket.on("action", routes(socket, {
        broadcast: self.broadcast.bind(self),
        joinRoom: self.joinRoom.bind(self),
      }));

      socket.on("disconnect", () => {
        console.log("Client has disconnected", socket.decoded_token.user._id);

        User.updateById({ online: false }, socket.decoded_token.user._id)
        .then(() => {})

      });
    });
  }

  stop() {
    this.server.close(() => {
      console.log("SocketIO server closed")
    });
  }

  /**
   * Mindfuck double reduce loop
   */
  createNotifications(actions, user) {
    return Promise.resolve([]);
    return User.findAll({
        role: "admin",
        isActive: true,
        isRetired: false,
      })
      .then(admins => {
        return Promise.all(actions.reduce((accumulated, action) => {
          let forEachAdmin = admins.reduce((acc, admin) => {
            if (admin.id !== user.id) {
              return [...acc, Notification.saveOne({
                type: action.type,
                content: action.notification,
                RecipientId: admin.id,
                CreatedById: user.id,
              })]
            }
            return acc;
          }, []);
          return [...accumulated, ...forEachAdmin];
        }, []))
      })
  }

  joinRoom(roomId, userId) {
    if (this.server.sockets.adapter.rooms[`user/${userId}`]) {
      const socketsKeys = Object.keys(this.server.sockets.adapter.rooms[`user/${userId}`].sockets);
      // what if more than 1 ??? lul or 0????? even worse...
      const clientId = socketsKeys[0];
      const socket = this.server.sockets.connected[clientId];
      socket.join(`room/${roomId}`);
    }
  }

  /**
   * Broadcasts recent changes to all users involved in the namespaces
   * namespaces can be one of the following: ["all", "admin", "print-person", "professor", "user"]
   * update is structured as such:
   * {
   *   add: {
   *    Thesis: [ array of thesis objects ]
   *    ThesisProgress: [ array of thesisProgress objects ]
   *   },
   *   update: {
   *     CouncilMeeting: [ array of CouncilMeeting objects ]
   *   }
   * }
   * @param {Array} namespaces - list of namespaces to be notified of changes
   * @param {Array} actions - list of actions for the redux-store
   */
  broadcast(notifiedRooms, actions, user) {
    console.log("brudcasting")
    // console.log(notifiedRooms)
    // console.log(actions)
    // console.log(user)
    return this.createNotifications(actions, user)
      .then(notifications => {

        const prunedActions = actions.map(action => {
          return {
            type: action.type,
            payload: action.payload,
          }
        })
        console.log(this.server.sockets.adapter.rooms)
        notifiedRooms.map(room => {
          if (this.server.sockets.adapter.rooms[room]) {
            Object.keys(this.server.sockets.adapter.rooms[room].sockets).map(clientId => {
              const socket = this.server.sockets.connected[clientId];
              // console.log(socket.decoded_token)
              // create notifications only for those admins that are marked as recipients
              // const notificationActions = notifications.reduce((accumulated, notification) => {
              //   if (socket.decoded_token.user.id === notification.RecipientId) {
              //     accumulated.push({
              //       type: "NOTIFICATION_ADD_ONE",
              //       payload: notification,
              //     })
              //   }
              //   return accumulated;
              // }, [])
              this.server.in(clientId).emit("server:push", prunedActions);
            })
          }
        })
      })
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
