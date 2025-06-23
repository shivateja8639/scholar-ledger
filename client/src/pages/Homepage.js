import React, { useState, useEffect } from "react";
import { Input, Modal, Form, Select, message, Table, DatePicker } from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Layout from "./../components/Layout/Layout";
import axios from 'axios';
import Spinner from "../components/Layout/Spinner";
import moment from "moment";
import '../index.css';
import Analytics from "../components/Layout/Analytics";
const { RangePicker } = DatePicker;
const HomePage = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([])
  const [frequency, setFrequency] = useState('7')
  const [selectedDate, setSelectdate] = useState([])
  const [type, setType] = useState('all')
  const [viewData, setViewData] = useState('table')
  const [editable, setEditable] = useState(null)
  //table data
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference'
    },
    {
      title: 'Actions',
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setEditable(record);
                setShowModal(true);
              }}
              style={{ cursor: "pointer" }}
            />
            <DeleteOutlined
              className="mx-2"
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                handleDelete(record);
              }}
            />

          </div>
        );
      }
    }
  ]


  //getall transactions


  //useEffect hook
  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        const res = await axios.post('/transactions/get-transaction',
          {
            userid: user._id,
            frequency,
            selectedDate,
            type
          })
        setLoading(false)
        setAllTransaction(res.data)
        console.log(res.data)
      } catch (error) {
        console.log(error)
        message.error('Fetch Issue with Transaction')
      }
    }
    getAllTransaction()
  }, [frequency, selectedDate, type])



  //delete handler
  const handleDelete = async (record) => {
  console.log("handleDelete called with:", record); // Debugging log
  try {
    setLoading(true);
    await axios.post('/transactions/delete-transaction', { transactionId: record._id });
    setLoading(false);
    message.success('Transaction Deleted!');
  } catch (error) {
    console.error(error);
    setLoading(false);
    message.error('Unable to delete');
  }
};



  //form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setLoading(true)
      if (editable) {
        await axios.post('/transactions/edit-transaction',
          {
            payload: {
              ...values,
              userId: user._id
            },
            transactionId: editable._id
          })
        setLoading(false)
        message.success('Transaction Updated Successfully')
      } else {
        await axios.post('/transactions/add-transaction',
          { ...values, userid: user._id })
        setLoading(false)
        message.success('Transaction Added Successfully')
      }
      setShowModal(false)
      setEditable(null)
    } catch (error) {
      setLoading(false)
      message.error('failed to add transaction')
    }
  }
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === 'custom' &&
            <RangePicker
              value={selectedDate} onChange={(values) => setSelectdate(values)}
            />}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('table')}
          />

          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('analytics')}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>

      </div>
      <div className="content">
        {viewData === 'table' ?
          <Table columns={columns} dataSource={allTransaction} />
          : <Analytics allTransaction={allTransaction} />
        }

      </div>
      <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        {/* Replace your Form and related handlers with the following:*/}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            ...editable,
            date: editable ? moment(editable.date) : null
          }}
        >
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

          {/* 🔄 FIXED: DatePicker expects moment object */}
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