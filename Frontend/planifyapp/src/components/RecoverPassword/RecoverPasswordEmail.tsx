import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../../styles/Auth.css";
import AuthenticationNavbar from "../Navbar/AuthenticationNavbar";

const RecoverPasswordEmail: React.FC = () => {
  const [Email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success("Email confirmed successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Error confirming email!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const handleConfirmEmail = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.get(`http://localhost:3005/v1/users/confirm-email/${Email}`);
      showSuccess();
      navigate("/RecoverPassword/ChangePassword", { state: { email: Email } });
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
                    Forgot your password
                  </h5>
                  <br />
                  <form
                    className="auth-form-signin"
                    onSubmit={handleConfirmEmail}
                  >
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
                      <br />
                      <Button
                        variant="light"
                        id="login-users"
                        className="auth-btn"
                        type="submit"
                      >
                        Confirm Email
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

export default RecoverPasswordEmail;
