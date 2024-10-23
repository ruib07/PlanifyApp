import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../styles/Auth.css";
import AuthenticationNavbar from "../Navbar/AuthenticationNavbar";

const Register: React.FC = () => {
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success("Registration completed successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Registration was not completed!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      Name,
      Email,
      Password,
    };

    try {
      await axios.post("http://localhost:3005/v1/users", newUser);
      showSuccess();

      setName("");
      setEmail("");
      setPassword("");
      navigate("/Authentication/Login");
    } catch (error) {
      showError();
    }
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  return (
    <>
      <AuthenticationNavbar />
      <br />
      <br />
      <div className="auth-container">
        <div className="auth-grid">
          <div className="auth-card-container col-sm-9 col-md-7 col-lg-5">
            <div className="auth-card1 col-sm-9 col-md-7 col-lg-5">
              <div className="auth-card auth-card-signin my-5">
                <div className="auth-card-body">
                  <h5 className="auth-card-title text-center">
                    Create an account
                  </h5>
                  <br />
                  <form className="auth-form-signin" onSubmit={registerUser}>
                    <div className="auth-inputs">
                      <div className="auth-form-label-group">
                        <input
                          type="text"
                          id="Name"
                          name="Name"
                          className="form-control"
                          placeholder="Name"
                          required
                          value={Name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="auth-form-label-group">
                        <input
                          type="email"
                          id="Email"
                          name="Email"
                          className="form-control"
                          placeholder="Email"
                          required
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="auth-form-label-group">
                        <input
                          type={visible ? "password" : "text"}
                          id="Password"
                          name="Password"
                          className="form-control"
                          placeholder="Password"
                          required
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className="auth-eyeicon"
                          onClick={togglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={visible ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                      <br />
                      <Button
                        variant="light"
                        id="register-users"
                        className="auth-btn"
                        type="submit"
                      >
                        Create Account
                      </Button>
                      <br />
                      <br />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
