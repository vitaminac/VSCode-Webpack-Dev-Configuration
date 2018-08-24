const http = require('http');
const fs = require('fs');
const path = require('path');

const middlewares = []

const multipart = function (req, res, next) {
    if (req.method.toUpperCase() === "POST") {
        if (req.headers["content-type"].toLowerCase().trim().includes("multipart/form-data")) {
            var output = fs.createWriteStream("output", { flags: "w" });
            req.on("data", (chunk) => output.write(chunk));
            req.once("end", () => output.end());
        }
    }
    next(req, res);
}
const mappings = [];

// middlewares
middlewares.push(multipart);

// handlers
mappings.push({
    pattern: /^\/upload\/?/,
    handler: function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="/upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="upload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
});

mappings.push({
    pattern: "",
    handler: function (req, res, err) {
        var file = "." + path.normalize(req.url);
        fs.exists(file, function (exists) {
            if (exists) {
                fs.stat(file, function (error, stat) {
                    if (error) {
                        return err(error);
                    }
                    if (stat.isDirectory()) {
                        err(403);
                    }
                    else {
                        const readStream = fs.createReadStream(file);
                        readStream.on('error', err);
                        res.writeHead(200);
                        readStream.pipe(res);
                    }
                });
            } else {
                err(404);
            }
        });
    }
});


const PORT = process.env.PORT || 9000;
http.createServer(function (req, res) {
    const error = (code, message) => {
        res.writeHead(code ? code : 500);
        if (code === 404 && !message) {
            message = "Not found";
        } else if (code === 403 && !message) {
            message = "Forbidden";
        }
        res.end(message ? message : "Internal Server Error")
    };
    // middleware context
    req.context = {};
    middlewares.reduce((next, middleware) => {
        return (req, res) => middleware(req, res, next);
    }, function (req, res) {
        for (const map of mappings) {
            if (req.url.match(map.pattern) !== undefined && req.url.match(map.pattern) !== null) {
                return map.handler(req, res, error);
            }
        }
    })(req, res);
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));