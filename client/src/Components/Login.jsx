import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/login", {
      username,
      email,
      password,
    })
      .then((Response) => {
        if (Response.data.status) {
    
          navigate("/");
        }
        else{
            alert("Enter Valid information")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" title="Login Button">
          Login
        </button><br />
        <Link to="/forgotPassword">Forgot Password</Link>
        <p>
          Don't Have Account? <Link to="/signup">Sign Up</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
