import express from "express";
import { protect } from "../middlewares/Auth.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/TaskController.js";

const taskRouter = express.Router();

taskRouter.get("/todos", protect, getTasks);
taskRouter.get("/todo/:id", protect, getTaskById);
taskRouter.post("/todo/create", protect, createTask);
taskRouter.patch("/todo/update/:id", protect, updateTask);
taskRouter.delete("/todo/delete/:id", protect, deleteTask);
taskRouter.patch("/todo/update-status/:id", protect, updateTaskStatus);

export default taskRouter;
