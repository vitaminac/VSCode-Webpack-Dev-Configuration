const http = require('http');
const fs = require('fs');
const path = require('path');

// list de object {pattern: /* regex pattern */, handler: /* function(req, res, err){} */}
const middlewares = []

const multipart = function (req, res, next) {
    if (req.method.toUpperCase() === "POST") {
        if (req.headers["content-type"].toLowerCase().trim().includes("multipart/form-data")) {
            var output = fs.createWriteStream("../static/output", { flags: "w" });
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
    pattern: "",
    handler: function (req, res, err) {
        var file = ".." + path.normalize(req.url);
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

exports.createServer = function () {
    return http.createServer(function (req, res) {
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
    });
}