import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./utils/Mongoose.js";
import authRoute from "./routes/AuthRoute.js";
import taskRouter from "./routes/TaskRoute.js";

const app = express();
const port = process.env.PORT || 7000;

// Calling DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Welcome Hari!!!");
// });

app.use("/api/user", authRoute);
app.use("/api/task", taskRouter);

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
