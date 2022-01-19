import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate, Navigate, Link } from "react-router-dom";
import Axios from "axios";
import "./style.css";
// import LOGIN from "../login/index";

const BASE_URL = process.env.REACT_APP_LOCAL_URL;
const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [images, setImages] = useState([]);
  const [banner, setBanner] = useState([]);

  const user = useSelector((state) => state.user);
  const navigation = useNavigate();

  const TOKEN = localStorage.getItem("token");
  if (!TOKEN) {
    return <Navigate to="/login" />;
  }
  console.log("global user : ", user);
  return <div className="home-container"></div>;
}

export default Home;
