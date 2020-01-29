const jwt = require("jsonwebtoken");
const { authSecret } = require("./../.env");

module.exports = {
  verificar(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, authSecret);
      req.usuario = decode;
      next();
    } catch (error) {
      return res.status(401).send({
        mensagem: "Você precisa se autenticar",
        statusCode: 401
      });
    }
  },
  opcional(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, authSecret);
      req.usuario = decode;
      next();
    } catch (error) {
      next();
    }
  },
};
