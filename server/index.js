const socket = require("./socket.js");
const http = require("./http.js");

const server = http.createServer();
socket.wrap(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));