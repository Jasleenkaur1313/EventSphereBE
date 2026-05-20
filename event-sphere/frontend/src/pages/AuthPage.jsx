import React, { useState, useEffect } from 'react';
import TermsModal from '../components/TermsModal';
import '../styles/auth.css';

// Firebase imports

function PasswordFeedback({ password }) {
    if (password.length === 0) return null;

    const requirements = {
        length: { check: password.length >= 8, text: "At least 8 characters" },
        uppercase: { check: /[A-Z]/.test(password), text: "At least 1 uppercase letter" },
        lowercase: { check: /[a-z]/.test(password), text: "At least 1 lowercase letter" },
        number: { check: /[0-9]/.test(password), text: "At least 1 number" },
        special: { check: /[^A-Za-z0-9]/.test(password), text: "At least 1 special character" },
    };

    const passedCount = Object.values(requirements).filter(r => r.check).length;
    const totalCount = Object.values(requirements).length;
    let strengthText = 'Very Weak';
    let strengthColor = '#DC143C'; // Crimson

    if (passedCount === totalCount) {
        strengthText = 'Very Strong';
        strengthColor = '#27ae60';
    } else if (passedCount >= 4) {
        strengthText = 'Strong';
        strengthColor = '#2ecc71';
    } else if (passedCount >= 3) {
        strengthText = 'Moderate';
        strengthColor = '#f1c40f';
    } else if (passedCount >= 2) {
        strengthText = 'Weak';
        strengthColor = '#e67e22';
    }

    return (
        <div id="passwordFeedbackContainer">
            <div className="password-strength">
                <div className="strength-text" style={{ color: strengthColor }}>
                    Password strength: {strengthText}
                </div>
            </div>

            <div className="requirements-list">
                {Object.values(requirements).map((req, index) => (
                    <div key={index} className={`requirement ${req.check ? 'valid' : 'invalid'}`}>
                        <span className="requirement-icon">
                            <i className={`fas fa-${req.check ? 'check' : 'times'}-circle`}></i>
                        </span>
                        <span>{req.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Main AuthPage ---
export default function AuthPage({ onNavigate, onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', studentId: '', email: '', password: '', confirmPassword: '', major: '', terms: false
  });
  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);

  // Utility to clear specific or all errors
  const clearErrors = (field = null) => {
    if (field) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    } else {
        setErrors({});
    }
  };
  const handleLoginChange = (e) => {
  setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  clearErrors(e.target.id + "Error");
};
  // --- Registration Handlers ---
  const handleRegisterChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setRegisterForm(prev => {
        const updatedForm = { ...prev, [id]: newValue };
        
        // Live validation for password match
        if (id === 'password' || id === 'confirmPassword') {
            const password = id === 'password' ? newValue : prev.password;
            const confirm = id === 'confirmPassword' ? newValue : prev.confirmPassword;
            if (confirm.length > 0 && password !== confirm) {
                setErrors(prevErr => ({ ...prevErr, confirmPasswordError: "Passwords do not match." }));
            } else {
                clearErrors('confirmPasswordError');
            }
        }
        return updatedForm;
    });
    clearErrors(id + 'Error');
  };

  const validateRegistrationForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Required fields check
    if (!registerForm.name.trim()) newErrors.nameError = "Full Name is required.";
    if (!registerForm.studentId.trim()) newErrors.studentIdError = "Student ID is required.";
    if (!registerForm.email) newErrors.emailError = "Email is required.";
    if (!registerForm.password) newErrors.regPasswordError = "Password is required.";
    if (!registerForm.confirmPassword) newErrors.confirmPasswordError = "Confirmation password is required.";
    if (!registerForm.terms) newErrors.termsError = "You must agree to the Terms of Service.";
    
    // Format and consistency checks
    if (registerForm.email && !emailRegex.test(registerForm.email)) newErrors.emailError = "Please enter a valid email address.";
    if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPasswordError = "Passwords do not match.";

    // Password strength check (relying on PasswordFeedback logic)
    const passwordReqs = [
        registerForm.password.length >= 8,
        /[A-Z]/.test(registerForm.password),
        /[a-z]/.test(registerForm.password),
        /[0-9]/.test(registerForm.password),
        /[^A-Za-z0-9]/.test(registerForm.password),
    ];
    if (registerForm.password.length > 0 && !passwordReqs.every(r => r)) {
        newErrors.regPasswordError = "Password does not meet all security requirements.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleLoginSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  if (!loginForm.username) newErrors.usernameError = "Email cannot be empty.";
  if (!loginForm.password) newErrors.passwordError = "Password is required.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }


  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9001'}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginForm.username,
        password: loginForm.password
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("eventSphereAuthToken", data.token);

      const adminFlag = data.user.email.startsWith("admin");
      localStorage.setItem("eventSphereIsAdmin", String(adminFlag));

      onLoginSuccess(adminFlag);
    } else {
      setErrors({ usernameError: data.message });
    }

  } catch (error) {
    console.error(error);
    setErrors({ usernameError: "Login failed" });
  }
};

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  clearErrors();

  if (validateRegistrationForm()) {
    try {

const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9001'}/api/auth/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: registerForm.name,
    studentId: registerForm.studentId,
    email: registerForm.email,
    password: registerForm.password,
    major: registerForm.major
  })
});

const data = await res.json();

if (data.success) {
  setIsLoginView(true);
  setErrors({ loginSuccess: "Registration successful! Please sign in." });
  setRegisterForm({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    major: '',
    terms: false
  });
} else {
  setErrors({ emailError: data.message });
}


    } catch (error) {
        console.error(error);
        setErrors({ emailError: "Registration failed" });

    }
  }
};  
  const handleSwitch = (isLogin) => {
      setIsLoginView(isLogin);
      setLoginForm({ username: '', password: '' });
      setRegisterForm({ name: '', studentId: '', email: '', password: '', confirmPassword: '', major: '', terms: false });
      setErrors({});
  }

  // --- Rendering Logic ---
  const getContainerStyle = (isVisible) => ({
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    visibility: isVisible ? 'visible' : 'hidden',
    position: isVisible ? 'relative' : 'absolute',
    top: isVisible ? 'auto' : '-9999px',
    left: isVisible ? 'auto' : '-9999px',
    transform: 'none',
    transition: 'opacity 0.5s ease',
  });

  return (
    <>
      <div id="authWrapper">
        
        {/* Login Container */}
        <div className="container" id="loginFormContainer" style={getContainerStyle(isLoginView)}>
          <h2 className="title">Event Sphere Login</h2>
          {errors.loginSuccess && (
            <div className="success-message" style={{ display: 'block', backgroundColor: '#ecfdf5', borderLeft: '5px solid #059669', color: '#065f46', padding: '1rem', borderRadius: '0.25rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
              ✅ {errors.loginSuccess}
            </div>
          )}
          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label htmlFor="username" className="form-label">Email</label>
              <input type="text" id="username" className="form-input" placeholder="Enter your mail" required value={loginForm.username} onChange={handleLoginChange} />
              <span id="loginUsernameError" className="error-message" style={{ display: errors.usernameError ? 'block' : 'none' }}>{errors.usernameError}</span>
            </div>
            <div className="input-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" className="form-input" placeholder="Enter your password" required value={loginForm.password} onChange={handleLoginChange} />
              <span id="loginPasswordError" className="error-message" style={{ display: errors.passwordError ? 'block' : 'none' }}>{errors.passwordError}</span>
            </div>
            <button type="submit" className="submit-button">Sign In</button>
            <p className="link-text">
              Don't have an account? <span className="link" id="switchToRegister" onClick={() => handleSwitch(false)}>Register here.</span>
            </p>
          </form>
        </div>

        {/* Register Container */}
        <div className="container" id="registerFormContainer" style={getContainerStyle(!isLoginView)}>
          <h2 className="title">Event Sphere Register</h2>
          <form id="registerForm" onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" id="name" className="form-input" placeholder="Enter your full name" required value={registerForm.name} onChange={handleRegisterChange} />
              <span id="nameError" className="error-message" style={{ display: errors.nameError ? 'block' : 'none' }}>{errors.nameError}</span>
            </div>
            <div className="input-group">
              <label htmlFor="studentId" className="form-label">Student ID</label>
              <input type="text" id="studentId" className="form-input" placeholder="Enter your Student ID" required value={registerForm.studentId} onChange={handleRegisterChange} />
              <span id="studentIdError" className="error-message" style={{ display: errors.studentIdError ? 'block' : 'none' }}>{errors.studentIdError}</span>
            </div>
            <div className="input-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" className="form-input" placeholder="Enter your email" required value={registerForm.email} onChange={handleRegisterChange} />
              <span id="emailError" className="error-message" style={{ display: errors.emailError ? 'block' : 'none' }}>{errors.emailError}</span>
            </div>
            <div className="input-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" className="form-input" placeholder="Enter your password" required value={registerForm.password} onChange={handleRegisterChange} />
              <span id="regPasswordError" className="error-message" style={{ display: errors.regPasswordError ? 'block' : 'none' }}>{errors.regPasswordError}</span>
              <PasswordFeedback password={registerForm.password} />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" id="confirmPassword" className="form-input" placeholder="Confirm your password" required value={registerForm.confirmPassword} onChange={handleRegisterChange} />
              <span id="confirmPasswordError" className="error-message" style={{ display: errors.confirmPasswordError ? 'block' : 'none' }}>{errors.confirmPasswordError}</span>
            </div>
            <div className="input-group">
              <label htmlFor="major" className="form-label">Major/Department</label>
              <input type="text" id="major" className="form-input" placeholder="e.g., Computer Science, Business" value={registerForm.major} onChange={handleRegisterChange} />
            </div>
            <div className="input-group">
              <label className="checkbox-label">
                <input type="checkbox" required className="checkbox-input" id="terms" checked={registerForm.terms} onChange={handleRegisterChange} />
                <span style={{ marginLeft: '0.5rem' }}>
                  I agree to the <span className="link" onClick={() => setShowTerms(true)}>Terms of Service</span>
                </span>
              </label>
              <span id="termsError" className="error-message" style={{ display: errors.termsError ? 'block' : 'none' }}>{errors.termsError}</span>
            </div>
            <button type="submit" className="submit-button">Register</button>
            <p className="link-text">
              Already have an account? <span className="link" id="switchToLogin" onClick={() => handleSwitch(true)}>Login here.</span>
            </p>
          </form>
        </div>
      </div>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
}