import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminHomePage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 10 characters long, contain one special character, and one uppercase letter');
      return;
    }

    // Perform any authentication logic here (API call, etc.) if needed

    // Clear form errors
    setEmailError('');
    setPasswordError('');

    // Navigate to the '/user' page
    navigate('/admin');
  };

  const validateEmail = (email) => {
    // Regular expression pattern for email validation
    const emailPattern = /^\S+@\S+\.\S+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Regular expression pattern for password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{10,}$/;
    return passwordPattern.test(password);
  };

  return (
    //used bootstrap and card view and card body
    //https://getbootstrap.com/docs/5.0/layout/containers/
    //https://getbootstrap.com/docs/5.0/components/card/
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 150px)'}}>
        <div className="col-md-4">
          <div className="card" >
            <div className="card-body" >
              <h2 className="text-center">Login Page</h2>
              <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label style={{ marginTop: '20px' }}>Email:</label>
                  <input type="email" className={`form-control form-control-sm mx-sm-2 ${emailError ? 'is-invalid' : ''}`} id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}

                </div>
                <div className="form-group">
                  <label style={{ marginTop: '20px' }}>Password:</label>
                  <input type="password" className={`form-control form-control-sm mx-sm-2 ${passwordError ? 'is-invalid' : ''}`} id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  <div style={{ marginTop: '15px' }}></div>

                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
