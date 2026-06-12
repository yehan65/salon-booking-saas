require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./main/app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("URL Validated"))
  .catch((error) => {
    console.error("Something caught up: ", error);
  });
mongoose.connection.once("open", () => {
  console.log("Connected to the MONGODB...");
});
mongoose.connection.on("error", (error) => {
  console.log(`Cannot connect to the MONGODB: ${error}`);
});

server.listen(PORT, () => {
  console.log(`Server is UP and RUNNING on PORT ${PORT}...`);
});

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected successfully');
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });
