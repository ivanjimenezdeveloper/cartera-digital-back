const bcrypt = require("bcrypt");
const { crearError } = require("../../utilities/errores");
const User = require("../model/User");

const loginUsuario = async (username, password) => {
  try {
    const usuario = await User.findOne({ username });

    if (usuario === null || !usuario.username) {
      throw crearError("Credenciales incorrectas", 403);
    }

    const contrasenyaCoincide = password === usuario.password;

    if (typeof contrasenyaCoincide === "undefined" || !contrasenyaCoincide) {
      throw crearError("Credenciales incorrectas", 403);
    }

    return usuario;
  } catch (err) {
    throw crearError(
      err.message ? err.message : "No se ha podido comprobar el usuario",
      err.codigo ? err.codigo : 500
    );
  }
};

module.exports = {
  loginUsuario,
};
