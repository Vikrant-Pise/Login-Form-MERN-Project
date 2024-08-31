//gpt code + My code
import express from "express";
import bcrypt from "bcrypt";
// import jwt, { verify } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/user.js";
import cookieParser from "cookie-parser";


const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "User Already Existed" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashpassword,
    });

    await newUser.save();

    return res.json({ status: true, message: "Record Registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User is not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ message: "Password is incorrect" });
  }

  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
  return res.json({ status: true, message: "Login Successfully" });
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User Not Registered" });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, process.env.KEY, {
      expiresIn: "5m",
    });

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vikrantpise98@gmail.com",
        pass: "efnqpxyunlsuvppo",
      },
    });

    // Define the mail options
    const mailOptions = {
      from: "vikrantpise98@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click the link to reset your password: http://localhost:5173/resetPassword/${token}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ status: true, message: "Error Sending Email " });
      } else {
        return res.json({ status: true, message: "Email Sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// reset password my code
// router.post("/reset-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     const decoded = await jwt.verify(token, process.env.KEY);
//     const id = decoded.id;
//     const hashPassword = await bcrypt.hash(password, 10);
//     await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
//     return res.json({ status: true, message: "Updated password" });
//   } catch (err) {
//     return res.json({ status: true, message: "Invalid Token" });
//   }
// });

// reset password gpt
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email; // Change to match your payload

    // Find user by email instead of ID
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save(); // Save the updated user

    return res.json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.json({ status: false, message: "Invalid or expired token" });
  }
});

// dashboard
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookie.token;
    if (!token) {
      return res.json({ status: false, message: "No Token" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {}
};

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

//logout
router.get("/logout", (req, res) => {
  res.clearCookie('token')
  return res.json({ status: true});
});

export { router as UserRouter };
