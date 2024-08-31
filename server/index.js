import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
dotenv.config()
import { UserRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";



const app = express();
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials: true
}))
app.use('/auth', UserRouter )

//connect with mongodb compass database
mongoose.connect('mongodb://127.0.0.1:27017/authentication')


app.listen(process.env.PORT, () => {
  console.log("Server is Running...");
});

