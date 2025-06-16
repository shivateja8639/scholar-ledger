const transactionModel = require('../models/transactionModel')
const moment=require('moment')
const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body; // extract selectedDate here
        const dateFilter = frequency !== 'custom' 
          ? { date: 
            { $gt: moment().subtract(Number(frequency), 'd').toDate() 

            } }
          : { date: 
            { $gt: selectedDate[0], $lte: selectedDate[1] 

            } };
          
        const transactions = await transactionModel.find({
            ...dateFilter,
            userid: req.body.userid,
            ...(type !== 'all' && {type}),
        });
        res.status(200).send(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


const addTransaction = async (req, res) => {
  try {
    const { date, ...rest } = req.body;

    const newTransaction = new transactionModel({
      ...rest,
      date: new Date(date) // Ensures proper Date object
    });

    await newTransaction.save();
    res.status(201).send('Transaction Created');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


module.exports={getAllTransaction,addTransaction,editTransaction,deleteTransaction}