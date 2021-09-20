const express = require("express");
const { check, validationResult } = require("express-validator");
const { getSaldo } = require("../../db/controller/user");

const router = express.Router();

router.get(
  "/saldo/:idUsuario",
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
      const saldo = await getSaldo(idUsuario);

      res.json(saldo);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
