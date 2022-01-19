import React, { useState, useMemo } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import _debounce from "lodash.debounce";
import Axios from "axios";
import "./style.css";

const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = `http://localhost:2000`;

function Register() {
  // local state
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [repass, setRePass] = useState("");
  const [loading, setLoading] = useState(false);

  // error state
  const [errorUserName, setErrorUserName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorRePass, setErrorRePass] = useState(false);

  // debounce function
  const dbValidateUserName = useMemo(
    () => _debounce(validateUserName, 1000),
    []
  );
  const dbValidateEmail = useMemo(() => _debounce(validateEmail, 1000), []);
  const dbValidatePass = useMemo(() => _debounce(validatePassword, 1000), []);

  // initialize navigation
  const navigate = useNavigate();

  function validateUserName(username) {
    // rules : username must min 6 char & include number
    if (username.length < 6 || !/[0-9]/.test(username)) {
      setErrorUserName(true);
      return;
    }

    // is valid
    setErrorUserName(false);
  }

  function validateEmail(email) {
    // roles : email validation
    let validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!validation.test(email)) {
      setErrorEmail(true);
      return;
    }

    // email is valid
    setErrorEmail(false);
  }

  function validatePassword(pass) {
    let numb = /[0-9]/;
    let special = /[!@#%$_^;]/;

    // rules : must include number and special character
    if (!numb.test(pass) || !special.test(pass)) {
      setErrorPass(true);
      return;
    }

    // passoword is valid
    setErrorPass(false);
  }

  const onHandleUserName = (event) => {
    let value = event.target.value;
    setUserName(value);
    dbValidateUserName(value);
  };

  const onHandleEmail = (event) => {
    let value = event.target.value;
    setEmail(value);
    dbValidateEmail(value);
  };

  const onHandlePass = (event) => {
    let value = event.target.value;
    setPass(value);
    dbValidatePass(value);
  };

  // TODO : validasi repassword === password

  const onButtonRegister = () => {
    // console.log(username, email, pass, repass)
    const newUser = {
      UID: Date.now(),
      username: username,
      email: email,
      password: pass,
      role: 2,
    };
    // console.log(newUser)

    // TODO : check if data is empty or not

    // sent data to server
    setLoading(true);
    // check if user or email is already used
    Axios.get(API_URL + `/users?username=${username}&email=${email}`)
      .then((respond) => {
        // user already exist -> respond.data = [{ ... }]
        if (respond.data.length) {
          setErrorRePass(true);
          setLoading(false);
          return;
        }

        // user not exis -> respond.data = []
        Axios.post(API_URL + "/users", newUser).then((respond) => {
          console.log("respond", respond);

          setLoading(false);

          // if success redirect to login
          navigate("/login");
        });
      })
      .catch((error) => console.log(error));
  };

  // TODO : add page protection, if user already login, she/he cannot access this page -> redirect to hom

  const TOKEN = localStorage.getItem("token");

  if (TOKEN) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Register</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="@john"
              value={username}
              onChange={onHandleUserName}
              isInvalid={errorUserName}
            />
            {errorUserName ? (
              <Form.Text className="text-muted">
                username min 6 char & include number
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="john@xxx.com"
              value={email}
              onChange={onHandleEmail}
              isInvalid={errorEmail}
            />
            {errorEmail ? (
              <Form.Text className="text-muted">email doesn't valid</Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={pass}
              onChange={onHandlePass}
              isInvalid={errorPass}
            />
            {errorPass ? (
              <Form.Text className="text-muted">
                password minimal 6 char, include number & special char !@#%$_^;
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Re-password</Form.Label>
            <Form.Control
              type="password"
              value={repass}
              onChange={(e) => setRePass(e.target.value)}
              isInvalid={errorRePass}
            />
            {errorRePass ? (
              <Form.Text className="text-muted">
                password doesnt match
              </Form.Text>
            ) : null}
          </Form.Group>

          {/* // TODO : tampilkan error if user already exist or data is empty */}

          <Button
            variant="primary"
            onClick={onButtonRegister}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
