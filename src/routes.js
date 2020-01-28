const express = require("express");
const routes = express.Router();

const ProductController = require('./controllers/ProductController')
const RequestController = require('./controllers/RequestController')

routes.get("/produtos", ProductController.index);
routes.post("/produtos", ProductController.store);
routes.get("/produtos/:id", ProductController.show);
routes.put("/produtos/:id", ProductController.update);
routes.delete("/produtos/:id", ProductController.destroy);

routes.get("/pedidos", RequestController.index);
routes.post("/pedidos", RequestController.store);
routes.get("/pedidos/:id", RequestController.show);
routes.delete("/pedidos/:id", RequestController.destroy);

module.exports = routes;
