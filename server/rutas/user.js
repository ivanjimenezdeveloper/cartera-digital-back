const express = require("express");
const jwt = require("jsonwebtoken");
const debug = require("debug")("api-prestalo:db:endpoints");
const chalk = require("chalk");

const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const { loginUsuario, getSaldo } = require("../../db/controller/user");

const router = express.Router();

router.post(
  "/login",
  body("username", "Formato de nombre de usuario incorrecto").isAscii(),
  body("password", "Formato de password incorrecto").isAscii(),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      debug(chalk.red(errores.array()));
      const nuevoError = new Error(errores.array().map((error) => error.msg));
      nuevoError.codigo = 400;
      return next(nuevoError);
    }
    next();
  },
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const resultadoUsuario = await loginUsuario(username, password);

      if (!resultadoUsuario) {
        const err = new Error("el nombre de usuario o contraseña no coincide");
        err.codigo = 400;
        next(err);
      } else {
        const resultadoUsuarioSeguro = {
          _id: resultadoUsuario._id,
          username: resultadoUsuario.username,
        };

        const token = jwt.sign(
          { usuario: resultadoUsuarioSeguro },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.json({ token });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
