import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('https://notely-backend-api.onrender.com/login', {
        email,
        password,
      });

      const data = res.data;
      const token = res.data.token;

      // Store user data
      localStorage.setItem('token', token);
      localStorage.setItem('username', data.user.username);

      setMessage('Login successful! Redirecting...');
      setMessageType('success');

      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      setIsLoading(false);

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || 'An error occurred';

        // Handle 403 Forbidden with modal
        if (status === 403) {
          setModalContent({
            title: 'Access Denied',
            message: errorMessage || 'You do not have permission to access this account. Please verify your credentials or contact support.'
          });
          setShowModal(true);
        }
        // Handle 401 Unauthorized
        else if (status === 401) {
          setMessage('Invalid email or password');
          setMessageType('error');
        }
        // Handle 404 Not Found
        else if (status === 404) {
          setMessage('Account not found. Please sign up first.');
          setMessageType('error');
        }
        // Handle other errors
        else {
          setMessage(errorMessage);
          setMessageType('error');
        }
      } else if (error.request) {
        setMessage('Network error. Please check your connection.');
        setMessageType('error');
      } else {
        setMessage('An unexpected error occurred');
        setMessageType('error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: '', message: '' });
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="form_area">
          <p className="title">LOGIN</p>
          <form onSubmit={handleLogin}>
            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input
                placeholder="Enter your email"
                className="form_style"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="form_group">
              <label className="sub_title" htmlFor="password">Password</label>
              <div className="password_wrapper">
                <input
                  placeholder="Enter your password"
                  className="form_style"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle_password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div className="form_group">
              <button className="btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="loader">
                    <span className="spinner"></span> Logging in...
                  </span>
                ) : (
                  'LOGIN'
                )}
              </button>
            </div>
            {message && (
              <p className={`message ${messageType}`}>{message}</p>
            )}
            <p className="signup_text">
              Don't have an account? <a className="link" href="/signup">Sign up here!</a>
            </p>
          </form>
        </div>
      </div>

      {/* Modal for 403 errors */}
      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{modalContent.title}</h2>
              <button className="close_btn" onClick={closeModal}>×</button>
            </ModalHeader>
            <ModalBody>
              <div className="icon_wrapper">
                <span className="error_icon">⚠️</span>
              </div>
              <p>{modalContent.message}</p>
            </ModalBody>
            <ModalFooter>
              <button className="modal_btn" onClick={closeModal}>OK</button>
              <button className="modal_btn secondary" onClick={() => navigate('/signup')}>
                Sign Up Instead
              </button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    min-height: 70vh;
    padding: 20px;
  }

  .form_area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #EDDCD9;
    height: auto;
    width: 100%;
    max-width: 400px;
    border: 2px solid #264143;
    border-radius: 20px;
    box-shadow: 3px 4px 0px 1px #E99F4C;
    padding: 30px;
    margin-top: 20px;
  }

  .title {
    color: #264143;
    font-weight: 900;
    font-size: 1.5em;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .sub_title {
    font-weight: 600;
    margin: 5px 0;
    color: #264143;
  }

  .form_group {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin: 10px 0;
    width: 100%;
  }

  .password_wrapper {
    position: relative;
    width: 100%;
  }

  .form_style {
    outline: none;
    border: 2px solid #264143;
    box-shadow: 3px 4px 0px 1px #E99F4C;
    width: 100%;
    padding: 12px 10px;
    border-radius: 4px;
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .form_style:focus {
    transform: translateY(2px);
    box-shadow: 1px 2px 0px 0px #E99F4C;
  }

  .form_style:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .toggle_password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
  }

  .toggle_password:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .btn {
    padding: 15px;
    margin: 25px 0px 10px;
    width: 100%;
    font-size: 15px;
    background: #DE5499;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 3px 3px 0px 0px #E99F4C;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    color: white;
  }

  .btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(2px);
    box-shadow: 1px 1px 0px 0px #E99F4C;
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
  }

  .message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .signup_text {
    margin-top: 15px;
    font-size: 14px;
    color: #264143;
  }

  .link {
    font-weight: 800;
    color: #DE5499;
    padding: 5px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .link:hover {
    text-decoration: underline;
  }

  /* Responsive design */
  @media (max-width: 480px) {
    .container {
      padding: 10px;
    }

    .form_area {
      padding: 20px 15px;
      max-width: 100%;
    }

    .title {
      font-size: 1.3em;
    }

    .form_style {
      font-size: 14px;
      padding: 10px 8px;
    }

    .btn {
      font-size: 14px;
      padding: 12px;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  overflow: hidden;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, #DE5499, #c44386);
  color: white;

  h2 {
    margin: 0;
    font-size: 1.3em;
    font-weight: 700;
  }

  .close_btn {
    background: none;
    border: none;
    color: white;
    font-size: 32px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const ModalBody = styled.div`
  padding: 30px 25px;
  text-align: center;

  .icon_wrapper {
    margin-bottom: 15px;
  }

  .error_icon {
    font-size: 50px;
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  p {
    color: #333;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 25px;
  display: flex;
  gap: 10px;
  justify-content: center;
  background-color: #f8f9fa;

  .modal_btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .modal_btn:not(.secondary) {
    background: #DE5499;
    color: white;

    &:hover {
      background: #c44386;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(222, 84, 153, 0.3);
    }
  }

  .modal_btn.secondary {
    background: white;
    color: #264143;
    border: 2px solid #264143;

    &:hover {
      background: #264143;
      color: white;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;

    .modal_btn {
      width: 100%;
    }
  }
`;

export default LoginForm;