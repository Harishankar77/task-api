import mongoose from "mongoose";
import { Task } from "../models/TaskModel.js";

// Utility: Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a Task
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Task title is required",
        success: false,
        statusCode: 400,
      });
    }

    const data = await Task.create({
      title: title.trim(),
      user: req.user._id,
    });

    res.status(200).json({
      message: "Task created successfully",
      success: true,
      data,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating task",
    });
  }
};

// Get All Tasks (optionally filtered by status)
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    // count for task
    const total = await Task.countDocuments({ user: req.user._id });
    const active = await Task.countDocuments({
      user: req.user._id,
      status: "active",
    });
    const completed = await Task.countDocuments({
      user: req.user._id,
      status: "completed",
    });

    if (status) {
      query.status = status;
    }

    const data = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      active,
      completed,
      data,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching tasks",
    });
  }
};

// Get Single Task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    const data = await Task.findOne({ _id: id, user: req.user._id });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
        statusCode: 400,
      });
    }

    res.status(200).json({ success: true, data, statusCode: 200 });
  } catch (error) {
    console.error("Get Task By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching task by ID",
    });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (status) updateFields.status = status;

    const data = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateFields,
      { new: true }
    );

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
        statusCode: 400,
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      success: true,
      data,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while updating task",
    });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    const deleted = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
        statusCode: 400,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting task",
    });
  }
};

// Update Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    if (!status || !["active", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing status. Allowed: 'active' or 'completed'",
        statusCode: 400,
      });
    }

    const data = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Task not found",
        statusCode: 400,
      });
    }

    res.status(200).json({
      message: `Task marked as ${status}`,
      success: true,
      data,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Update Task Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating task status",
    });
  }
};
