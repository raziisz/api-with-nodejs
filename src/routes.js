const express = require("express");
const routes = express.Router();

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads/')
  },
  filename: function(req, file, callback) {
    callback(null, new Date().getMilliseconds() + file.originalname);
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})

const ProductController = require('./controllers/ProductController')
const RequestController = require('./controllers/RequestController')

routes.get("/produtos", ProductController.index);
routes.post("/produtos", upload.single('produto_imagem'), ProductController.store);
routes.get("/produtos/:id", ProductController.show);
routes.put("/produtos/:id", ProductController.update);
routes.delete("/produtos/:id", ProductController.destroy);

routes.get("/pedidos", RequestController.index);
routes.post("/pedidos", RequestController.store);
routes.get("/pedidos/:id", RequestController.show);
routes.delete("/pedidos/:id", RequestController.destroy);

module.exports = routes;
