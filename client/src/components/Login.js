import React from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Login = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Login</h1>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-control"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <p>
      Need to register? <Link to="/register">Click here</Link>
    </p>
    </div>
  );
};

export default Login;

