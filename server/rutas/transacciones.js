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
  getTransacciones1MesPorUsuario,
  getTransacciones1AnyoPorUsuario,
  actualizarSaldo,
  anyadirTransaccion,
} = require("../../db/controller/historialTransacciones");
const { getSaldo } = require("../../db/controller/user");

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

router.get(
  "/mes/:idUsuario",
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
      const transacciones = await getTransacciones1MesPorUsuario(idUsuario);

      res.json(transacciones);
    } catch (err) {
      next(err);
    }
  }
);
router.get(
  "/anyo/:idUsuario",
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
      const transacciones = await getTransacciones1AnyoPorUsuario(idUsuario);

      res.json(transacciones);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/movimiento/:idUsuario",
  check("idUsuario", "Id incorrecta").isMongoId(),
  body("tipo", "Nombre de tipo incorrecto").isAscii(),
  body("cantidad", "Formato no numérico").isFloat(),
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
    const { tipo, cantidad } = req.body;

    try {
      let saldo = await getSaldo(idUsuario);

      if (tipo === "Recieved") {
        saldo += cantidad;
      } else {
        saldo -= cantidad;
      }
      await actualizarSaldo(idUsuario, saldo);
      await anyadirTransaccion(idUsuario, tipo, cantidad);

      res.json({ mensaje: "Saldo actualizado con exito" });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
