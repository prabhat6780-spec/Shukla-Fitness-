require("dotenv").config({ path: __dirname + "/.env" });


const app = require("./src/app");
const connectDB = require("./src/db/db");

const http = require("http");
const { Server } = require("socket.io");

connectDB();

/* 🔥 CREATE SERVER */
const server = http.createServer(app);

/* 🔥 SOCKET SETUP */
const io = new Server(server, {
  cors: {
    origin: "*", // for dev
  }
});

/* 🔥 SOCKET CONNECTION */
io.on("connection", (socket) => {
  console.log("🔥 Admin connected:", socket.id);

  // 🔄 send live updates every 5 sec
  setInterval(async () => {

    try {
      const User = require("./src/models/user.models");
      const { Order } = require("./src/models/product.models");

      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();

      socket.emit("dashboard-update", {
        totalUsers,
        totalOrders
      });

    } catch (err) {
      console.log("Socket Error:", err.message);
    }

  }, 5000);

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

/* 🔥 START SERVER */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});