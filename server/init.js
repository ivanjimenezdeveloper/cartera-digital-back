require("dotenv").config();
const debug = require("debug")("api-prestalo:db:endpoints");
const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const morganfreeman = require("morgan");
const jwt = require("jsonwebtoken");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const { loginUsuario } = require("../db/controller/user");

const app = express();
const puerto = process.env.PORT || process.env.PUERTO_SERVIDOR || 5000;

const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    const nuevoError = new Error("Petición no autentificada");
    nuevoError.codigo = 403;
    return next(nuevoError);
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = datosToken.usuario._id;
    req.idUsuario = id;
    next();
  } catch (e) {
    // Token incorrecto
    if (e.message.includes("expired")) {
      const nuevoError = new Error("Token caducado");
      nuevoError.codigo = 403;
      return next(nuevoError);
    }

    const nuevoError = new Error("Token erroeno");
    nuevoError.codigo = 403;
    next(e);
  }
};

const iniciaServidor = () => {
  const servidor = app.listen(puerto, () => {
    debug(chalk.yellow(`Servidor iniciado en el puerto ${puerto}`));
  });

  app.use(morganfreeman("dev"));
  app.use(cors());
  app.use(express.json());

  servidor.on("error", (err) => {
    debug(
      chalk.red.bold(`Error al iniciar el servidor en el puerto ${puerto}`)
    );
    if (err.code === "EADDRINUSE") {
      debug(chalk.red.bold(`El puerto ${puerto} está ocupado`));
    }
  });

  app.post(
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
          const err = new Error(
            "el nombre de usuario o contraseña no coincide"
          );
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

  app.use((err, req, res, next) => {
    const codigo = err.codigo || 500;
    const mensaje = err.codigo ? err.message : "Pete general";
    if (mensaje.includes("Token caducado")) {
      err.expired = true;
    }
    console.log(err.message);
    res.status(codigo).json({ error: true, mensaje });
  });
};

module.exports = {
  app,
  iniciaServidor,
};
