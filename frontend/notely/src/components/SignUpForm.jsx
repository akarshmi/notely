import React, { useState } from 'react';
import styled from 'styled-components';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''

  });

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData)

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('User registered successfully!');
        // You can redirect or clear the form here
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      alert('Error connecting to the server');
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
              <input placeholder="Enter your full name" className="form_style" type="text" id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input placeholder="Enter your email" className="form_style" type="email" id="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form_group">
              <label className="sub_title" htmlFor="password">Password</label>
              <input placeholder="Enter your password" className="form_style" type="password" id="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="form_group">
              <button className="btn" type="submit">SIGN UP</button>
            </div>
            <p>Have an Account? <a className="link" href="/login">Login Here!</a></p>
          </form>
        </div>
      </div>
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
    
  }

  .form_area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #EDDCD9;
    height: auto;
    width: auto;
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
  }

  .sub_title {
    font-weight: 600;
    margin: 5px 0;
  }

  .form_group {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin: 10px;
  }

  .form_style {
    outline: none;
    border: 2px solid #264143;
    box-shadow: 3px 4px 0px 1px #E99F4C;
    width: 290px;
    padding: 12px 10px;
    border-radius: 4px;
    font-size: 15px;
  }

  .form_style:focus, .btn:focus {
    transform: translateY(4px);
    box-shadow: 1px 2px 0px 0px #E99F4C;
  }

  .btn {
    padding: 15px;
    margin: 25px 0px;
    width: 290px;
    font-size: 15px;
    background: #DE5499;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 3px 3px 0px 0px #E99F4C;
    cursor: pointer;
    border: none;
  }

  .btn:hover {
    opacity: .9;
  }

  .link {
    font-weight: 800;
    color: #264143;
    padding: 5px;
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }
`;


export default SignUpForm;
