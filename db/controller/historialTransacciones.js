const { crearError } = require("../../utilities/errores");
const HistorialTransacciones = require("../model/HistorialTransacciones");
const User = require("../model/User");

const getTransaccionesPorUsuario = async (idUsuario) => {
  try {
    const { historial } = await HistorialTransacciones.findOne({
      user: idUsuario,
    });

    return historial;
  } catch (err) {
    throw crearError(
      err.message
        ? err.message
        : "No se ha podido comprobar el historial de transacciones",
      err.codigo ? err.codigo : 500
    );
  }
};

const ordenarHistorialPorFechaMayorMenor = (historial) =>
  historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

const getTransacciones1SemanaPorUsuario = async (idUsuario) => {
  const historial = await getTransaccionesPorUsuario(idUsuario);
  const fechaDeCorte = new Date();
  fechaDeCorte.setDate(fechaDeCorte.getDate() - 7);

  ordenarHistorialPorFechaMayorMenor(historial);

  return historial.filter(
    (transaccion) => new Date(transaccion.fecha) > fechaDeCorte
  );
};

const getTransacciones1MesPorUsuario = async (idUsuario) => {
  const historial = await getTransaccionesPorUsuario(idUsuario);
  const fechaDeCorte = new Date();
  fechaDeCorte.setDate(fechaDeCorte.getDate() - 30);

  ordenarHistorialPorFechaMayorMenor(historial);

  return historial.filter(
    (transaccion) => new Date(transaccion.fecha) > fechaDeCorte
  );
};

const getTransacciones1AnyoPorUsuario = async (idUsuario) => {
  const historial = await getTransaccionesPorUsuario(idUsuario);
  const fechaDeCorte = new Date();
  fechaDeCorte.setDate(fechaDeCorte.getDate() - 365);

  ordenarHistorialPorFechaMayorMenor(historial);

  return historial.filter(
    (transaccion) => new Date(transaccion.fecha) > fechaDeCorte
  );
};

const actualizarSaldo = async (idUsuario, nuevoSaldo) => {
  try {
    await User.findOneAndUpdate({ user: idUsuario }, { saldo: nuevoSaldo });

    return true;
  } catch (err) {
    throw crearError("No se ha podido actualizar el saldo del usuario", 500);
  }
};

const anyadirTransaccion = async (idUsuario, tipo, cantidad) => {
  try {
    HistorialTransacciones.findOneAndUpdate(
      { user: idUsuario },
      { $addToSet: { historial: { tipo, cantidad, fecha: new Date() } } },
      async (err, result) => {
        if (err) {
          const error = crearError(
            "No se ha podido añadir la transaccion al historial",
            500
          );
          throw error;
        }
      }
    );
  } catch (err) {
    throw crearError("No se ha podido añadir la transacción", 500);
  }
};

module.exports = {
  getTransaccionesPorUsuario,
  getTransacciones1SemanaPorUsuario,
  getTransacciones1MesPorUsuario,
  getTransacciones1AnyoPorUsuario,
  actualizarSaldo,
  anyadirTransaccion,
};
