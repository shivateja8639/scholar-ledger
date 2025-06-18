import React, { useState } from "react";
import { Form, Modal } from "antd";
import Layout from "./../components/Layout/Layout";
import Spinner from "../../../../expense-management-system/client/src/components/Layout/Spinner";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
    const [allTransaction, setAllTransaction] = useState([])
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
