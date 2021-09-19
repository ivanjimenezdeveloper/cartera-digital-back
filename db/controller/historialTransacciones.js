const { crearError } = require("../../utilities/errores");
const HistorialTransacciones = require("../model/HistorialTransacciones");

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

  ordenarHistorialPorFechaMayorMenor(historial);

  return historial.slice(0, 7);
};
module.exports = {
  getTransaccionesPorUsuario,
  getTransacciones1SemanaPorUsuario,
};
