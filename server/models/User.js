
// gtp code working
import express from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Correctly defined
  email: { type: String, required: true, unique: true }, // Correctly defined
  password: { type: String, required: true }, // Correctly defined
});

export const User = mongoose.model("User", userSchema);




//my code not working 
// import express from "express";
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   username: { types: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, unique: true },
// });

// const UserModel = mongoose.model("User", UserSchema);

// export { UserModel as User };

