import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../DB/connection.js";
import authRouter from "../src/modules/Auth/auth.router.js";
import postRouter from "../src/modules/Post/post.router.js";
import userRouter from "../src/modules/User/user.router.js";
import { globalErrHandling } from "./utils/ErrorHandling.js";
import cors from "cors";
import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initApp = (app, express) => {
  connectDB();
  app.use(express.json({}));
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

  var whitelist = [
    "http://localhost:5173",
    "https://melmesery.github.io/MERN_UP_VOTE/",
  ]; 

  app.use(async (req, res, next) => {
    if (!whitelist.includes(req.header("origin"))) {
      return next(new Error("Not Allowed By CORS", { cause: 403 }));
    }
    await res.header("Access-Control-Allow-Origin", "*");
    await res.header("Access-Control-Allow-Headers", "*");
    await res.header("Access-Control-Allow-Private-Network", "true");
    await res.header("Access-Control-Allow-Methods", "*");
    next();
  });

  app.use(bodyParser.json());

  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);

  app.all("*", (req, res, next) => {
    return res.json({ message: "In-valid Routing" });
  });

  app.use(globalErrHandling);
};

export default initApp;
