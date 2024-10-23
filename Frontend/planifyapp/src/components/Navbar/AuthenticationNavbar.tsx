import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../assets/planifyicon.png";

const AuthenticationNavbar: React.FC = () => {
  return (
    <nav
      id="mainNavbar"
      className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
    >
      <div className="container-fluid">
        <div className="navbar-collapse justify-content-center">
          <Link to="/" className="navbar-brand ms-2">
            <img src={Icon} alt="Planify Logo" className="navbar-logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticationNavbar;
