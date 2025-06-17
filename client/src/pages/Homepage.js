import React, { useState } from "react";
import { Form, Modal } from "antd";
import Layout from "./../components/Layout/Layout";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  //form handling
  const handleSubmit=(value)=>{
    console.log(values)
  }
  return (
    <Layout>
      <div className="filters">
        <div>range filters</div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Button
          </button>
        </div>
      </div>
      <div className="content"></div>
      <Modal
        title="Add Transaction"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Amount is required' }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='type' name='type' rules={[{ required: true, message: 'Type is required' }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='category' name='category' rules={[{ required: true, message: 'Category is required' }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">project</Select.Option>
              <Select.Option value="food">food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">medical</Select.Option>
              <Select.Option value="fee">fee</Select.Option>
              <Select.Option value="tax">tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Date' name="date" rules={[{ required: true, message: 'Date is required' }]}>
            <DatePicker className="w-100" />
          </Form.Item>

          <Form.Item label='Reference' name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label='Description' name="description" rules={[{ required: true, message: 'Description is required' }]}>
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
