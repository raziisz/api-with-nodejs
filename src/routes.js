const express = require("express");
const routes = express.Router();

const multer = require('multer')
const authenticate = require('./../middleware/login');

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
const UserController = require('./controllers/UserController')

routes.get("/produtos", ProductController.index);
routes.post("/produtos", authenticate.verificar, upload.single('produto_imagem'), ProductController.store);
routes.get("/produtos/:id", ProductController.show);
routes.put("/produtos/:id", authenticate.verificar, ProductController.update);
routes.delete("/produtos/:id", authenticate.verificar, ProductController.destroy);

routes.get("/pedidos", RequestController.index);
routes.post("/pedidos", authenticate.verificar, RequestController.store);
routes.get("/pedidos/:id", RequestController.show);
routes.delete("/pedidos/:id", authenticate.verificar, RequestController.destroy);

routes.post('/cadastro', UserController.new);
routes.post('/login', UserController.login);

module.exports = routes;
