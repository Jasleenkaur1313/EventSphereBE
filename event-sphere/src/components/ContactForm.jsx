import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (formValues) => {
    const newErrors = {};
    let isValid = true;

    if (formValues.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    }
    if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newForm = { ...form, [id]: value };
    setForm(newForm);
    // Live validation on change
    validate(newForm); 
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate(form)) return;

  try {
    const res = await fetch('http://localhost:9001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert(data.error || 'Something went wrong.');
    }
  } catch (err) {
    alert('Could not connect to server. Make sure backend is running.');
  }
  };
  
  const isFormValid = Object.keys(errors).length === 0 && form.name && form.email && form.message;
  
  // Helper to determine input class based on validation state
  const getInputClass = (id) => {
      const hasValue = form[id].length > 0;
      if (!hasValue) return '';
      return errors[id] ? 'invalid' : 'valid';
  }

  return (
    <section className="contact-section" id="contact">
      <h2>📩 Contact us</h2>
      <form id="contactForm" onSubmit={handleSubmit} noValidate>
        {['name', 'email', 'message'].map((id) => (
          <div className="form-group" key={id}>
            <label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}:</label>
            {id === 'message' ? (
                <textarea
                    id={id}
                    name={id}
                    placeholder=" Write your message..."
                    value={form[id]}
                    onChange={handleChange}
                    className={getInputClass(id)}
                ></textarea>
            ) : (
                <input 
                  type={id === 'email' ? 'email' : 'text'}
                  id={id}
                  name={id}
                  placeholder={` Enter your ${id}`}
                  value={form[id]}
                  onChange={handleChange}
                  className={getInputClass(id)}
                />
            )}
            
            <span className="error-message">{errors[id]}</span>
            <span className="valid-icon" style={{ display: !errors[id] && form[id].length > 0 ? 'inline' : 'none' }}>✔</span>
          </div>
        ))}
        
        <button type="submit" id="submitBtn" disabled={!isFormValid}>
          Send Message
        </button>
        
        {isSubmitted && (
          <p id="successMessage" style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>
            ✅ Message sent successfully!
          </p>
        )}
      </form>
    </section>
  );
}
