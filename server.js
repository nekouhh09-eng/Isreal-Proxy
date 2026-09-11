const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { createServer } = require("node:http");
const { publicPath } = require("ultraviolet-static");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { join } = require("node:path");

const bare = createBareServer("/bare/");
const app = express();

// Serve your new tab page as the index
app.use(express.static(__dirname + "/public"));

// Serve UV static files
app.use("/uv/", express.static(uvPath));

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
    console.log(`Running on http://localhost:${port}`);
});   