const app = require("../app");
const { mongodbConnection } = require("./database");

const PORT = process.env.PORT || 3000;

// Connect to mongo db
mongodbConnection();

// Start Server
const server = app.listen(PORT, () => {
  console.log("app running in port ", PORT);
});

// Handle rejection errors outside express
process.on("unhandledRejection", (error) => {
  console.log("UnhandledRejection Error: \n", error);
  server.close(() => {
    console.log("server shutting down ...");
    process.exit(1);
  });
});
