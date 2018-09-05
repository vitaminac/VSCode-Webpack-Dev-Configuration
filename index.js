const socket = require("./server/socket.js");
const http = require("./server/http.js");
const dplayer = require("./server/dplayer.js");

const server = http.createServer([dplayer.dplayerMapping], [], "./static");
socket.wrap(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));