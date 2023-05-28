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
  app.use(cors({}));

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
