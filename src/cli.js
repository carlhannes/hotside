const express = require('express');
const expressWs = require('express-ws');
const watch = require('watch');
const fs = require('fs');

const port = 16567;
const sockets = [];
let app;

function broadcast(rawmsg) {
  let msg = rawmsg;

  if (typeof msg === 'object') {
    msg = JSON.stringify(msg);
  }

  sockets.forEach((socket) => {
    try {
      socket.send(msg);
    } catch (e) {
      console.error(e);
    }
  });
}

function sendFile(f) {
  if (f && typeof f === 'string') {
    fs.readFile(f, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      broadcast({
        f,
        data: data.toString(),
      });

      console.log('Sending', f);
    });
  }
}

function watcher() {
  watch.watchTree('./node_modules/', {
    ignoreDotFiles: true,
    ignoreUnreadableDir: true,
    ignoreDirectoryPattern: /node_modules\/(.*)\/node_modules/giu,
  }, (f) => {
    sendFile(f);
  });
}

function main() {
  app = express();
  expressWs(app);

  app.ws('/', (ws) => {
    sockets.push(ws);

    ws.on('message', (rawMsg) => {
      const msg = JSON.parse(rawMsg);

      if (msg && msg.get) {
        sendFile(msg.get);
      }
    });
  });

  app.listen(port, () => {
    console.log('Started on port', port);
  });

  watcher();
}

main();
