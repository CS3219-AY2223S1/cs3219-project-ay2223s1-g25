const io = require("socket.io-client");
const app = require("../server");

const initSocket = () => {
  return new Promise((resolve, reject) => {
    const port = 5001;
    const socket = io(`http://localhost:${port}`, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });

    const timer = setTimeout(() => {
      reject(new Error("Failed to connect wihtin 5 seconds."));
    }, 5000);

    socket.on("connected", () => {
      clearTimeout(timer);
      resolve(socket);
    });
  });
};

const destroySocket = (socket) => {
  return new Promise((resolve, reject) => {
    // check if socket connected
    if (socket.connected) {
      // disconnect socket
      socket.disconnect();
      socket.close();
      resolve(true);
    } else {
      // not connected
      console.log("no connection to break...");
      resolve(false);
    }
  });
};

describe("test suit: Chat Service", () => {
  let socketClient, socketClient1;

  test("test: Connect two clients", async () => {
    const serverResponse = new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Failed to get reponse, connection timed out..."));
      }, 3000);
      const socketC = await initSocket();
      const socketC1 = await initSocket();
      socketClient = socketC;
      socketClient1 = socketC1;
      clearTimeout(timer);
      resolve([socketC, socketC1]);
    });
    const message = await serverResponse;
    expect(message[0]).not.toBe(message[1]);
  }, 10000);

  test("test: Join Same Room", async () => {
    const serverResponse = new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Failed to get reponse, connection timed out..."));
      }, 3000);
      await socketClient.emit("signin", "roomid123");
      await socketClient1.emit("signin", "roomid123");
      var it = app.sockets.adapter.rooms.get(socketClient.id).values();
      var first = it.next();
      var value = first.value;
      clearTimeout(timer);
      resolve(value);
    });

    const message = await serverResponse;
    expect(message).toBe(socketClient.id);
  }, 10000);

  test("test: Send Message", async () => {
    const serverResponse = new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Failed to get reponse, connection timed out..."));
      }, 3000);
      await socketClient.emit("send-msg", "this is a random string");
      socketClient1.on("got-msg", (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    const message = await serverResponse;
    expect(message).toBe("this is a random string");
  }, 10000);

  afterAll((done) => {
    destroySocket(socketClient);
    destroySocket(socketClient1);
    app.close();
    done();
  });
});
