const http = require('http');
const fs = require('fs');
const path = require('path');

// inject util functions
http.ServerResponse.prototype.sendFile = function (filename, callback) {
    const self = this;
    filename = path.join(path.resolve(process.cwd(), self.context.static), filename);

    fs.exists(filename, function (exists) {
        if (exists) {
            fs.stat(filename, function (error, stat) {
                if (error) {
                    return self.sendError(error);
                }
                if (stat.isDirectory()) {
                    self.sendError(403);
                }
                else {
                    const readStream = fs.createReadStream(filename);
                    readStream.on('error', self.sendError);
                    self.writeHead(200);
                    readStream.pipe(self);
                }
            });
        } else {
            self.sendError(404);
        }
    });
}

http.ServerResponse.prototype.sendError = function (code, message) {
    this.writeHead(code ? code : 500);
    if (code === 404 && !message) {
        message = "Not found";
    } else if (code === 403 && !message) {
        message = "Forbidden";
    }
    this.end(message ? message : "Internal Server Error")
}

// middlewares
const middlewares = [function multipart(req, res, next) {
    if (req.method.toUpperCase() === "POST") {
        if (req.headers["content-type"].toLowerCase().trim().includes("multipart/form-data")) {
            var output = fs.createWriteStream(req.context.static + "/output", { flags: "w" });
            req.on("data", (chunk) => output.write(chunk));
            req.once("end", () => output.end());
        }
    }
    next(req, res);
}, (function () {
    const pattern = /^\/?api/;
    return function apiService(req, res, next) {
        if (req.url.match(pattern)) {
            req.url = req.url.replace(pattern, "");
        }
        next(req, res);
    }
})()];

exports.defaultMapping = {
    pattern: "",
    handler: function (req, res) {
        const file = path.normalize(req.url);
        res.sendFile(file);
    }
};
/**
 * 
 * @param  {...any} mappings 
 * Each Mapping has the following signature
 * {
 *   pattern: regex pattern,
 *   handler: function (req, res) { }
 * }
 */
exports.createServer = function (mappings, filters, static) {
    filters = filters ? middlewares.concat(filters) : middlewares;

    return http.createServer(function (req, res) {
        // middleware context
        req.context = res.context = {
            static: static
        };

        filters.reduce((next, middleware) => {
            return (req, res) => middleware(req, res, next);
        }, function (req, res) {
            for (const map of mappings) {
                if (req.url.match(map.pattern) !== undefined && req.url.match(map.pattern) !== null) {
                    return map.handler(req, res);
                }
            }
            return exports.defaultMapping.handler(req, res);
        })(req, res);
    });
};