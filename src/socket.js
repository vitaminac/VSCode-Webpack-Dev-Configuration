define(function () {
    let connection;
    return {
        open: function () {
            connection = new WebSocket('ws://localhost:9000/echo');
            // When the connection is open, send some data to the server
            connection.onopen = function () {
                console.log("WebSocket connection established");
            };

            // Log errors
            connection.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            // Log messages from the server
            connection.onmessage = function (e) {
                console.log('Server: ' + e.data);
                if (e.data.length === 4 && e.data === "Ping") {
                    connection.send("Pong");
                }
            };

            //const file = $('input[type="file"]').files[0];
            //connection.send(file);
        },
        send: function () {
            connection.send('Send something'); // Send the message 'Ping' to the server
        }
    };
});