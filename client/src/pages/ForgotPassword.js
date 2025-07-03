import React, { useState } from "react";
import axios from "axios";
import { message as antdMessage } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return antdMessage.error("Please enter a valid email.");
    }

    try {
      setLoading(true);
      const res = await axios.post("/users/forgot-password", { email });
      setMessage(res.data.message);
      antdMessage.success("Reset link sent! Please check your email.");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setMessage(errorMsg);
      antdMessage.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page d-flex align-items-center justify-content-center flex-column">
      <h2>Forgot Password</h2>
      <form className="w-50" onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className="mt-3 text-info">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
