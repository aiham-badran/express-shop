const app = require("../app");
const listEndpoints = require("express-list-endpoints");

// Log the list of routes in the application
console.log("List OF Routers :");
console.table(listEndpoints(app));
