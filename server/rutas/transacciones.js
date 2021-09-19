const express = require("express");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const {
  getTransaccionesPorUsuario,
  getTransacciones1SemanaPorUsuario,
} = require("../../db/controller/historialTransacciones");

const router = express.Router();

router.get(
  "/semana/:idUsuario",
  check("idUsuario", "Id incorrecta").isMongoId(),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      console.log(errores.array());
      const nuevoError = new Error(errores.array().map((error) => error.msg));
      nuevoError.codigo = 400;
      return next(nuevoError);
    }
    next();
  },
  async (req, res, next) => {
    const { idUsuario } = req.params;
    try {
      const transacciones = await getTransacciones1SemanaPorUsuario(idUsuario);

      res.json(transacciones);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
