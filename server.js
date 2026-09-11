const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { createServer } = require("node:http");
const { publicPath } = require("ultraviolet-static");
const { join } = require("node:path");

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(join(__dirname, "public")));
app.use("/uv/", express.static(publicPath));

// Debug: check if UV files are being found
app.get("/debug", (req, res) => {
    res.json({ publicPath, exists: require("fs").existsSync(publicPath) });
});

const server = createServer();

server.on("request", (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on("upgrade", (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const port = process.env.PORT || 8080;
server.listen({ port }, () => {
    console.log(`Running on port ${port}`);
    console.log(`UV path: ${publicPath}`);
});   
