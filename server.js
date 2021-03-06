"use strict";
require("rootpath")();
const express = require("express");
const yamljs = require("yamljs");
const swaggerui = require("swagger-ui-express");
const router = require("./router");
const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/errorHandler");
const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
var cors = require("cors");
const app = express();
const openapiDoc = yamljs.load("./openapi.yaml");
app.use(express.json());
app.use(cors());
app.use("/doc", swaggerui.serve, swaggerui.setup(openapiDoc));
app.use(jwt());
app.use(router);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
