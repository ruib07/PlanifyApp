import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../styles/Auth.css";
import AuthenticationNavbar from "../Navbar/AuthenticationNavbar";

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const showSuccess = () => {
    toast.success("Password changed successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Password was not changed!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      showError();
      return;
    }

    const changePassword = { newPassword, confirmNewPassword };

    try {
      await axios.put(
        `http://localhost:3005/v1/users/${email}/updatepassword`,
        changePassword
      );
      showSuccess();
      navigate("/Authentication/Login");
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
                  <h5 className="auth-card-title text-center">
                    Change Password
                  </h5>
                  <br />
                  <form
                    className="auth-form-signin"
                    onSubmit={handlePasswordChange}
                  >
                    <div className="auth-inputs">
                      <div className="auth-form-label-group">
                        <input
                          type={newPasswordVisible ? "password" : "text"}
                          id="Password"
                          name="Password"
                          className="form-control"
                          placeholder="Password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                          className="auth-eyeicon"
                          onClick={toggleNewPasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={newPasswordVisible ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                      <div className="auth-form-label-group">
                        <input
                          type={
                            confirmPasswordVisible ? "password" : "text"
                          }
                          id="ConfirmPassword"
                          name="ConfirmPassword"
                          className="form-control"
                          placeholder="Confirm Password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                        <span
                          className="auth-eyeicon"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={confirmPasswordVisible ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                      <br />
                      <Button
                        variant="light"
                        id="login-users"
                        className="auth-btn"
                        type="submit"
                      >
                        Change Password
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

export default ChangePassword;
