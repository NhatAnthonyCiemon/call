const express = require("express");
const { ExpressPeerServer } = require("peer");
const { send } = require("process");

const app = express();
const server = require("http").createServer(app);

// Tạo Peer Server
const peerServer = ExpressPeerServer(server, {
    debug: true, // Để log chi tiết nếu cần
    path: "/", // Đường dẫn có thể tùy chỉnh, ở đây là root
});

// Sử dụng Peer Server
app.use("/peerjs", peerServer); // Đường dẫn của Peer Server là `/peerjs`

app.get("/", (req, res) => {
    send("Hello World");
});
// Khởi động server
const PORT = 4500;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
