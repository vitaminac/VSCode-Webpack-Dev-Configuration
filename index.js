const socket = require("./server/socket.js");
const http = require("./server/http.js");

const server = http.createServer([
    {
        pattern: "/upload",
        handler: require("./server/upload.js")
    }
], [], "./static");
socket.wrap(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));