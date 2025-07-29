import { Auth } from "../models/AuthModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate Token
const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

// User Signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "all fields are required",
        success: false,
      });
    }
    // Check if User is already Registered or not
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User is Already Registered",
        success: false,
      });
    }
    // Password Hashing using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create a new User
    const newUser = await Auth.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    // Save the new User
    await newUser.save();
    return res.status(200).json({
      message: "User Registered Successfully!!",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    console.log(`Error During User Registeration ${error}`);
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }
    // Check if User is Registered or not
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // Check if User Entered password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }
    // Generate Token
    const token = generateToken(user._id.toString());
    res.status(200).json({
      message: "User Login Successfully !!",
      success: true,
      token,
      statusCode: 200,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(`Error During User Login ${error}`);
  }
};
