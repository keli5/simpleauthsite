function customlog(req, res, next) {
    req.url == "/favicon.ico" ? next() : null;
    if (res.headersSent) {
        console.log(`${req.ip}: HTTP ${req.method} ${req.url} (status ${res.statusCode})`)
    } else {
        res.on("finish", function() {
            console.log(`${req.ip}: HTTP ${req.method} ${req.url} (status ${res.statusCode})`)
        })
    }
    next();
}

exports.customlog = customlog;