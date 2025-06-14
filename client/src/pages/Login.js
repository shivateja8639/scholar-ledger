import React, { useState, useEffect } from "react";
import { Form, Input, } from "antd";
import { Link} from "react-router-dom";
const Login = () => {
  //from submit
  const submitHandler = async (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="resgister-page ">
        {loading && <Spinner />}
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
};

export default Login;