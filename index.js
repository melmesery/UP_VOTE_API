import * as dotenv from "dotenv";
import express from "express";
import initApp from "./src/app.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

initApp(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
