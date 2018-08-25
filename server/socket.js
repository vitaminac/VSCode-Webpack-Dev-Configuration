const WebSocket = require('ws');

exports.wrap = function (server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        ws.isAlive = true;
        ws.on('message', function pong(message) {
            console.log("Pong:", message);
            this.isAlive = true;
        });
        function ping() {
            ws.send("Ping");
            console.log("Ping")
        }
        function heartbeat() {
            if (ws.readyState === ws.OPEN && ws.isAlive) {
                ws.isAlive = false;
                ping();
            } else {
                console.log("Closing");
                ws.terminate();
                clearInterval(timer);
                console.log("Closed");
            }
        }
        const timer = setInterval(heartbeat, 5000);
    });
};