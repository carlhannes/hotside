import runScript from 'run-script';

export default function subscribe(path, cb) {
  const wsURL = 'ws://localhost:16567';

  const ws = new WebSocket(wsURL);

  ws.onopen = function onOpen() {
    const msg = JSON.stringify({
      get: path,
    });

    ws.send(msg);
  };

  ws.onmessage = function onWSmsg(rawmsg) {
    const msg = JSON.parse(rawmsg.data);

    if (path === msg.f) {
      const myModule = {
        exports: {},
      };

      console.warn('Loading new version of', path);

      runScript(msg.data, { module: myModule, exports: myModule.exports });
      cb(myModule.exports);
    }
  };
}
