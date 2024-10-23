import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Navbar from "./Navbar/Navbar";

interface User {
  Name: string;
  Email: string;
  Password: string;
  ProfilePicture: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [ProfilePicture, setProfilePicture] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success("User updated successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Error updating user!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("Id");
        const response = await axios.get(
          `http://localhost:3005/v1/users/${userId}`
        );

        const userData = response.data;
        setUser(userData);
        setName(userData.Name);
        setEmail(userData.Email);
        setPassword("");
        setProfilePicture(userData.ProfilePicture);
      } catch (error) {}
    };

    fetchUser();
  }, []);

  const handleUserUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const userId = localStorage.getItem("Id");

      const updatedUser = {
        Name,
        Email,
        Password: Password ? Password : undefined,
        ProfilePicture,
      };

      await axios.put(
        `http://localhost:3005/v1/users/update/${userId}`,
        updatedUser
      );
      showSuccess();
      navigate("/");
    } catch (error) {
      showError();
    }
  };

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="auth-container">
        <div className="auth-grid">
          <div className="card-container auth-col-sm-9 col-md-7 col-lg-5">
            <div className="card1 col-sm-9 col-md-7 col-lg-5">
              <div className="auth-card auth-card-signin my-5">
                <div className="auth-card-body">
                  <h5 className="auth-card-title text-center">Edit Profile</h5>
                  <br />
                  <form
                    className="auth-form-signin"
                    onSubmit={handleUserUpdate}
                  >
                    <div className="auth-inputs">
                      <div className="profile-picture-container">
                        {loadingImage && (
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        )}
                        {ProfilePicture && (
                          <img
                            src={ProfilePicture}
                            alt="Profile"
                            onLoad={handleImageLoad}
                            onError={() => setLoadingImage(false)}
                            style={{
                              display: loadingImage ? "none" : "inline-block",
                              width: "150px",
                              height: "160px",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </div>
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
                          type={visible ? "text" : "password"}
                          id="Password"
                          name="Password"
                          className="form-control"
                          placeholder="New Password (leave blank to keep current)"
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className="auth-eyeicon"
                          onClick={togglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={visible ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                      <div className="auth-form-label-group">
                        <input
                          type="text"
                          id="ProfilePicture"
                          name="ProfilePicture"
                          className="form-control"
                          placeholder="Profile Picture URL"
                          value={ProfilePicture}
                          onChange={(e) => {
                            setProfilePicture(e.target.value);
                            setLoadingImage(true);
                          }}
                        />
                      </div>
                      <br />
                      <Button
                        variant="light"
                        id="update-user"
                        className="auth-btn"
                        type="submit"
                      >
                        Save Changes
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
    </div>
  );
};

export default UserProfile;
