const transactionModel = require('../models/transactionModel');
const moment = require('moment');

// Get All Transactions
const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;

    let dateFilter = {};
    if (frequency === 'custom') {
      dateFilter = {
        date: {
          $gt: selectedDate[0],
          $lte: selectedDate[1],
        },
      };
    } else if (frequency !== 'all') {
      dateFilter = {
        date: {
          $gt: moment().subtract(Number(frequency), 'd').toDate(),
        },
      };
    }
    // if frequency === 'all', skip date filter (fetch everything)

    const transactions = await transactionModel.find({
      ...dateFilter,
      userid: req.body.userid,
      ...(type !== 'all' && { type }),
    });

    res.status(200).send(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).send('Transaction deleted');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Edit Transaction
const editTransaction = async (req, res) => {
  try {
    const result = await transactionModel.findOneAndUpdate(
      { _id: req.body.transactionid },
      req.body.payload,
      { new: true }
    );

    if (!result) {
      return res.status(404).send('Transaction not found');
    }
    res.status(200).send('Edit successful');
  } catch (error) {
    console.error("Edit error:", error);
    res.status(500).json(error);
  }
};

// Add Transaction
const addTransaction = async (req, res) => {
  try {
    const { date, ...rest } = req.body;

    const newTransaction = new transactionModel({
      ...rest,
      date: new Date(date), // Ensure proper Date object
    });

    await newTransaction.save();
    res.status(201).send('Transaction Created');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
