import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // Check password strength
    if (id === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength('medium');
    } else if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage('Please enter your name');
      setMessageType('error');
      return false;
    }

    if (!formData.email.trim()) {
      setMessage('Please enter your email');
      setMessageType('error');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }

    if (!formData.password) {
      setMessage('Please enter a password');
      setMessageType('error');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://notely-backend-api.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setMessageType('success');

        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect after delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        setIsLoading(false);
        const status = res.status;

        // Handle 403 Forbidden
        if (status === 403) {
          setModalContent({
            title: 'Registration Blocked',
            message: data.message || 'You are not authorized to create an account. This may be due to restrictions or account limitations.'
          });
          setShowModal(true);
        }
        // Handle 409 Conflict (user already exists)
        else if (status === 409) {
          setMessage('This email is already registered. Please login instead.');
          setMessageType('error');
        }
        // Handle 400 Bad Request
        else if (status === 400) {
          setMessage(data.message || 'Invalid registration data. Please check your information.');
          setMessageType('error');
        }
        // Handle other errors
        else {
          setMessage(data.message || 'Registration failed. Please try again.');
          setMessageType('error');
        }
      }
    } catch (error) {
      setIsLoading(false);
      setMessage('Error connecting to the server. Please check your connection.');
      setMessageType('error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: '', message: '' });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'strong': return '#28a745';
      default: return '#e0e0e0';
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="form_area">
          <p className="title">SIGN UP</p>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label className="sub_title" htmlFor="name">Name</label>
              <input
                placeholder="Enter your full name"
                className="form_style"
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input
                placeholder="Enter your email"
                className="form_style"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
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
              {passwordStrength && (
                <div className="password_strength">
                  <div className="strength_bar">
                    <div
                      className={`strength_fill ${passwordStrength}`}
                      style={{ backgroundColor: getPasswordStrengthColor() }}
                    ></div>
                  </div>
                  <span className={`strength_text ${passwordStrength}`}>
                    {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="form_group">
              <label className="sub_title" htmlFor="confirmPassword">Confirm Password</label>
              <div className="password_wrapper">
                <input
                  placeholder="Confirm your password"
                  className="form_style"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle_password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form_group">
              <button className="btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="loader">
                    <span className="spinner"></span> Signing up...
                  </span>
                ) : (
                  'SIGN UP'
                )}
              </button>
            </div>

            {message && (
              <p className={`message ${messageType}`}>{message}</p>
            )}

            <p className="login_text">
              Have an Account? <a className="link" href="/login">Login Here!</a>
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
                <span className="error_icon">🚫</span>
              </div>
              <p>{modalContent.message}</p>
            </ModalBody>
            <ModalFooter>
              <button className="modal_btn" onClick={closeModal}>OK</button>
              <button className="modal_btn secondary" onClick={() => navigate('/login')}>
                Go to Login
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

  .password_strength {
    width: 100%;
    margin-top: 8px;
  }

  .strength_bar {
    width: 100%;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
  }

  .strength_fill {
    height: 100%;
    width: 0;
    transition: all 0.3s ease;
  }

  .strength_fill.weak {
    width: 33%;
  }

  .strength_fill.medium {
    width: 66%;
  }

  .strength_fill.strong {
    width: 100%;
  }

  .strength_text {
    display: block;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 600;
  }

  .strength_text.weak {
    color: #dc3545;
  }

  .strength_text.medium {
    color: #ffc107;
  }

  .strength_text.strong {
    color: #28a745;
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

  .login_text {
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

    .sub_title {
      font-size: 14px;
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
    animation: shake 0.5s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
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

export default SignUpForm;