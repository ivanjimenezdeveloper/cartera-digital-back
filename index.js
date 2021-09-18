const { conectaMongo } = require("./db");
const { iniciaServidor } = require("./server/init");

conectaMongo(iniciaServidor);
