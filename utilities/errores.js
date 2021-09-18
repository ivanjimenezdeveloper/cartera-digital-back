const crearError = (mensaje, codigo) => {
  const error = new Error(mensaje);
  error.codigo = codigo;

  return error;
};

module.exports = { crearError };
