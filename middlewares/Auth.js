// import jwt from "jsonwebtoken";
// import { Auth } from "../models/AuthModel.js";

// export const protect = async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     res.json({ message: "Not Authorized", success: false, statusCode: 401 });
//   }
//   try {
//     const userId = jwt.decode(token, process.env.JWT_SECRET);
//     if (!userId) {
//       res.json({ message: "Not Authorized", statusCode: 401 });
//     }
//     req.user = await Auth.findById(userId).select("-password");
//     next();
//   } catch (error) {
//     res.json({ success: false, message: "Not Authorized", statusCode: 401 });
//   }
// };

import jwt from "jsonwebtoken";
import { Auth } from "../models/AuthModel.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Not Authorized",
      success: false,
      statusCode: 401,
    });
  }

  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET);
    if (!userId) {
      return res.status(401).json({
        message: "Not Authorized",
        success: false,
        statusCode: 401,
      });
    }

    req.user = await Auth.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
        statusCode: 401,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
      statusCode: 401,
    });
  }
};
