import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    try {
      await axios.post('/users/login', values);
      message.success("login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      message.error("something went wrong");
    }
  };
  return (
    <>
      <div className="resgister-page ">
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Login Form</h1>

          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <div className="d-flex justify-content-between">
            <Link to="/register">Not a user ? Cleck Here to regsiter</Link>
            <button className="btn btn-primary">Login</button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );

export default Login;