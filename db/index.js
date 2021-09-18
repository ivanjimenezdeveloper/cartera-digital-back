require("dotenv").config();
const debug = require("debug")("api-prestalo:db:conexion");
const chalk = require("chalk");
const mongoose = require("mongoose");

const conectaMongo = async (cb) => {
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err) => {
      if (err) {
        debug(chalk.red.bold("No se ha podido iniciar la base de datos"));
        debug(chalk.red.bold(err.message));
        return;
      }
      debug(chalk.magentaBright("Base de datos iniciada"));
      cb();
    }
  );
};

module.exports = { conectaMongo };
