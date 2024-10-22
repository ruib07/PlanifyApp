import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import '../../styles/Auth/Login.css';
import AuthenticationNavbar from '../Navbar/AuthenticationNavbar';

const Login: React.FC = () => {
  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success('Login Efetuado com sucesso!', {
      position: 'bottom-right',
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error('Login não foi efetuado!', {
      position: 'bottom-right',
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
      const res = await axios.post('http://localhost:3005/auth/usersignin', login);
      const userToken = res.data.userToken;

      if (userToken) {
        localStorage.setItem('userToken', userToken);
        showSuccess();
        navigate('/');
      } else {
        showError();
      }
    } catch (error) {
      showError();
    }
  };

  return (
    <>
      <AuthenticationNavbar /><br /><br />
      <div className="login-container">
        <div className="login-grid">
          <div className="card-container login-col-sm-9 col-md-7 col-lg-5">
            <div className="card1 login-col-sm-9 col-md-7 col-lg-5">
              <div className="login-card login-card-signin my-5">
                <div className="login-card-body">
                  <h5 className="login-card-title text-center">Login</h5>
                  <br />
                  <form className="login-form-signin" onSubmit={handleLogin}>
                    <div className="login-inputs">
                      <div className="login-form-label-group">
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
                      <div className="login-form-label-group">
                        <input
                          type={visible ? 'password' : 'text'}
                          id="Password"
                          name="Password"
                          className="form-control"
                          placeholder="Password"
                          required
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="login-eyeicon" onClick={togglePasswordVisibility}>
                          <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
                        </span>
                      </div>
                      <div className="login-forgot-remember ms-4">
                        <div className="forgotpassword">
                          <p 
                            className="login-forgotpassword-p" 
                            onClick={() => navigate('/Authentication/RecoverPassword/SendEmail')}
                          >
                            Forgot your password?
                          </p>
                        </div>
                      </div>

                      <br />
                      <Button variant="light" id="login-employees" className="login-btn" type="submit">
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