import mongoose from "mongoose";

import Config from "../config/config";

const config = Config();

mongoose
  .connect(config.database_URI || "", { autoIndex: true })
  .then(() => console.log("** MongoDB Re-Connected successfully **"))
  .catch((error) => console.error("** MongoDB Re-Connection Failed **", error));

const db = mongoose.connection;

export default db;
