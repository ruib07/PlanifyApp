import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../styles/Auth.css";
import AuthenticationNavbar from "../Navbar/AuthenticationNavbar";

const Login: React.FC = () => {
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success("Login successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Login was not successfull!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const login = { Email, Password };

    try {
      const res = await axios.post(
        "http://localhost:3005/auth/usersignin",
        login
      );
      const userToken = res.data.userToken;
      const userId = res.data.user.Id;

      if (userToken) {
        localStorage.setItem("userToken", userToken);
        localStorage.setItem("Id", userId);
        showSuccess();
        navigate("/");
      } else {
        showError();
      }
    } catch (error) {
      showError();
    }
  };

  return (
    <>
      <AuthenticationNavbar />
      <br />
      <br />
      <div className="auth-container">
        <div className="auth-grid">
          <div className="card-container auth-col-sm-9 col-md-7 col-lg-5">
            <div className="card1 col-sm-9 col-md-7 col-lg-5">
              <div className="auth-card auth-card-signin my-5">
                <div className="auth-card-body">
                  <h5 className="auth-card-title text-center">Login</h5>
                  <br />
                  <form className="auth-form-signin" onSubmit={handleLogin}>
                    <div className="auth-inputs">
                      <div className="auth-form-label-group">
                        <input
                          type="email"
                          id="Email"
                          name="Email"
                          className="form-control"
                          placeholder="Email"
                          required
                          autoFocus
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
                      <div className="auth-forgot-remember ms-4">
                        <div className="forgotpassword">
                          <Link
                            to="/RecoverPassword/EmailConfirmation"
                            className="auth-forgotpassword-p"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                      </div>

                      <br />
                      <Button
                        variant="light"
                        id="login-users"
                        className="auth-btn"
                        type="submit"
                      >
                        Login
                      </Button>
                    </div>
                  </form>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
