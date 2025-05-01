import React from "react";
import RegisterForm from "../components/Auth/RegisterForm"; // Adjust path if needed
import "../styles/form.css"; // Reuse form styles

const RegisterPage: React.FC = () => {
  return (
    <div className="form-container">
      <h1>Register New Account</h1>
      <RegisterForm />
      {/* Optional: Add a link back to login */}
      {/* <p className="form-link">
          Already have an account? <Link to="/login">Login here</Link>
      </p> */}
    </div>
  );
};

export default RegisterPage;
