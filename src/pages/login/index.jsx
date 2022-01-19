import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import "./style.css";

const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = "http://localhost:2000";

function Login(props) {
  // state
  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);

  // initialize navigation & redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // event handler
  const onButtonLogin = () => {
    // check username & password in our database
    setLoading(true);
    Axios.get(API_URL + `/users?username=${username}&password=${password}`)
      .then((respond) => {
        console.log(respond);

        // if error -> show error
        if (!respond.data.length) {
          setError(true);
          setLoading(false);

          return;
        }

        // save token or UID in web storage
        localStorage.setItem("token", respond.data[0].UID);

        // save data to global storage
        dispatch({
          type: "LOGIN",
          payload: respond.data[0],
        });

        setLoading(false);

        // if success
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  // side effect -> similiar with class component's lifecycle method
  useEffect(() => {
    console.log("side effect");

    // check token
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) return;

    setIsSignIn(true);
  }, []);

  // conditional rendering : auth protection
  if (isSignIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Sign In</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember Me" />
          </Form.Group>
          <h3 className="register-now">
            Don't have an account ? <Link to="/register">Register Now</Link>
          </h3>
          {error ? (
            <Alert variant="danger">
              Error : username or password doesn't match
            </Alert>
          ) : null}
          <Button variant="primary" onClick={onButtonLogin} disabled={loading}>
            {loading ? <Spinner animation="border" variant="light" /> : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
