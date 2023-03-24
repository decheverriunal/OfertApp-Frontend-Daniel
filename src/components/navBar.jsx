import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/Ofertapp.png";
import "../App.css";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Nope" style={{ width: "25%" }} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button >
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/homepage">
            Inicio
          </NavLink>
        </div>
      </div>
      <div>
        <button className="login-button" type="button">
          Iniciar sesion
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
