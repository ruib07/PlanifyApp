import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Navbar/Navbar.css";
import Icon from "../../assets/planifyicon.png";
import { Button, Dropdown } from "react-bootstrap";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<{ Name?: string }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getUserId = useCallback((): string | null => {
    const userToken = getLocalStorageItem("userToken");

    if (userToken) {
      const tokenParts = userToken.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.Id || null;
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const userId = getUserId();

      if (userId) {
        const userToken = getLocalStorageItem("userToken");

        if (userToken) {
          try {
            const response = await axios.get(
              `http://localhost:3005/v1/users/${userId}`,
              {
                headers: {
                  Authorization: `bearer ${userToken}`,
                },
              }
            );
            setUser(response.data);
          } catch (error) {}
        }
      }
    };

    getUser();
  }, [getUserId]);

  const userProfile = () => {
    navigate(`/UserProfile/${getUserId()}`);
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("Id");
    setUser({});
    navigate("/");
  };

  const getLocalStorageItem = (key: string): string | null => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAuthenticated = !!getLocalStorageItem("userToken");

  return (
    <nav
      id="mainNavbar"
      className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
    >
      <div className="container-fluid">
        <Button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded={isMenuOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </Button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <Link to="/" className="navbar-brand ms-3">
            <img
              src={Icon}
              alt="Planify Logo"
              className="navbar-logo"
              style={{ cursor: "pointer" }}
            />
          </Link>

          {isAuthenticated && (
            <div className="navbar-nav ms-auto me-auto">
              <Link to="/Event/Create" className="nav-link">
                Create Event
              </Link>
            </div>
          )}
        </div>

        {!isMenuOpen && (
          <div className="navbar-nav ms-auto me-2">
            {user.Name ? (
              <Dropdown>
                <Dropdown.Toggle
                  className="btn-transparent"
                  id="dropdown-basic"
                >
                  Hello, {user.Name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={userProfile}
                    style={{ cursor: "pointer" }}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={logoutUser}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div>
                <Dropdown>
                  <Dropdown.Toggle
                    className="btn-transparent"
                    id="dropdown-basic"
                  >
                    Authentication
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item style={{ cursor: "pointer" }}>
                      <Link
                        to="/Authentication/Login"
                        className="dropdown-links"
                      >
                        Login
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ cursor: "pointer" }}>
                      <Link
                        to="/Authentication/Registration"
                        className="dropdown-links"
                      >
                        Register
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
