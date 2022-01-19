import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import { LOGOUT } from "../actions/types";
import "./styles/navbar.css";

function NavigationBar() {
  // local state
  const [modal, setModal] = useState(false);

  // redux global state
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // initialise nativagion
  const navigation = useNavigate();

  // event handler
  const onButtonLogin = () => navigation("login");
  const onButtonLogout = () => setModal(true);
  const onButtonUserConfirm = () => {
    // clear local storage
    localStorage.removeItem("token");

    // clear global storage
    dispatch({ type: LOGOUT });

    setModal(false);
  };

  return (
    <Navbar expand="lg" className="nav-container">
      <Container fluid>
        <Navbar.Brand className="nav-brand" onClick={() => navigation("/")}>
          Todo List
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {/* <Nav.Link onClick={() => navigation("products")}>Products</Nav.Link> */}
          </Nav>
          <Nav.Item style={{ marginRight: 10 }}>{user.email || ""}</Nav.Item>
          {!user.UID ? (
            <Button variant="outline-success" onClick={onButtonLogin}>
              Login
            </Button>
          ) : (
            <Button variant="outline-success" onClick={onButtonLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Apakah anda ingin keluar ?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal(false)}>
            Tidak
          </Button>
          <Button variant="primary" onClick={onButtonUserConfirm}>
            Iya
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
}

export default NavigationBar;
