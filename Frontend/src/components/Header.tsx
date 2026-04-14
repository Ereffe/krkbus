import React from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <h1 className="header-title">krkbus</h1>
        <Link to="/login">
          <Button className="login-button">Zaloguj się</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
