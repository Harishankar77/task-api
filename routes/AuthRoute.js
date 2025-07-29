import express from "express";
import { login, signup } from "../controllers/AuthController.js";

const authRoute = express.Router();

authRoute.post("/register", signup);
authRoute.post("/login", login);

export default authRoute;
