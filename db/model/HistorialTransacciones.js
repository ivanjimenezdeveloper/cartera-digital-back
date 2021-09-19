const { Schema, model, SchemaTypes } = require("mongoose");

const HistorialTransaccionesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  historial: [
    {
      tipo: { type: String, required: true },
      cantidad: { type: Number, required: true },
      fecha: { type: Schema.Types.Date },
    },
  ],
});

const HistorialTransacciones = model(
  "HistorialTransacciones",
  HistorialTransaccionesSchema,
  "historialTransacciones"
);

module.exports = HistorialTransacciones;
