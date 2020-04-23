const socketDB = require("./socketDB");

/**
 * @param socketConfig {array} ["channel1","channel2"]
 * @param io {object} instance of socket.io
 */
const init = (socketConfig, io) => {
  socketConfig.map(opt => {
    const channel = typeof opt === "string" ? opt : opt[0];
    const { onConnect } = typeof opt === "string" ? {} : opt[1];
    io.of(`/${channel}`).on("connection", function(socket) {
      const { userId, platform } = socket.handshake.query;
      onConnect && onConnect(socket);
      var index = socketDB[channel][userId][platform].push(socket) - 1;

      socket.on("disconnect", reason => {
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
        }

        delete socketDB[channel][userId][platform][index];
      });
    });
  });
};

const proxiedSocketSet = new Proxy(init, {
  get(target, channel) {
    return socketDB[channel];
  }
});

module.exports = proxiedSocketSet;
