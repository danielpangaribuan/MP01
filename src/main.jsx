import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";
import "./index.css";

// components
import NavigationBar from "./components/navbar";

// pages
import Login from "./pages/login/";
import Home from "./pages/home/";
import Register from "./pages/register";
// import Products from "./pages/products";
// import ProductDetails from "./pages/product-details";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "http://localhost:2000";

function HomeProducts() {
  return <Outlet />;
}

function Main() {
  // initialize redux
  const dispatch = useDispatch();

  // keep-login
  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.get(API_URL + `/users?UID=${token}`) //
      .then((respond) => {
        console.log(respond);
        dispatch({ type: "LOGIN", payload: respond.data[0] });
      })
      .catch((error) => console.log(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container">
      <NavigationBar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* <Route path="products" element={<HomeProducts />}>
          <Route path="" element={<Products />} />
          <Route path="detail/:id" element={<ProductDetails />} />
        </Route> */}
      </Routes>
    </div>
  );
}

export default Main;
