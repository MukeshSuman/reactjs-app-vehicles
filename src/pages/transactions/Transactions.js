import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { format } from "date-fns";
import axios from "axios";


import { toast } from "react-toastify";

import { errorHandler } from '../../handler';


// components
import PageTitle from "../../components/PageTitle";
import AddTransaction from "./components/add";
import TransactionListTable from "./components/table";
import { Button as ChipButton } from "../../components/Wrappers";

import {
  API_ADD_NEW_TRANSACTION,
  API_GET_ALL_TRANSACTIONS,
  API_UPDATE_TRANSACTION,
  API_DELETE_TRANSACTION,
} from "../../constants/api";

const transactionInitData = {
  date: new Date(),
  name: "",
  type: "",
  amount: "",
  category: "",
  description: "",
}

export default function Transactions() {
  // local
  var [isLoading, setIsLoading] = useState(true);
  // var [isOpen, setIsOpen] = useState(false);
  var [error, setError] = useState(null);
  var [open, setOpen] = React.useState(false);
  var [transactionList, setTransactionList] = React.useState([]);
  var [copyTransactionList, setCopyTransactionList] = React.useState([]);
  var [dialogTitle, setDialogTitle] = React.useState("");
  var [dialogType, setDialogType] = React.useState("");
  var [transaction, setTransaction] = React.useState(transactionInitData);
  var [inProgress, setInProgress] = useState(false);


  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };


  useEffect(() => {
    getAllTransaction();
  }, []);

  const getAllTransaction = () => {
    axios
      .get(API_GET_ALL_TRANSACTIONS, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        setIsLoading(false);
        let transactionListArray = data.data;
        transactionListArray = transactionListArray.map(transaction => ({
          ...transaction,
          date: format(new Date(transaction.date), "yyyy-MM-dd"),
        }));
        setTransactionList(transactionListArray);
        setCopyTransactionList(transactionListArray);
      })
      .catch(error => {
        setError(errorHandler(error))
        setIsLoading(false)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const addTransaction = () => {
    setInProgress(true);
    axios
      .post(API_ADD_NEW_TRANSACTION, transaction, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllTransaction();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        setInProgress(false)
        errorHandler(error)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const updateTransaction = () => {
    setInProgress(true);
    axios
      .put(API_UPDATE_TRANSACTION + "/" + transaction._id, transaction, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllTransaction();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        setInProgress(false)
        errorHandler(error)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const deleteTransaction = _id => {
    setInProgress(true)
    axios
      .delete(API_DELETE_TRANSACTION + "/" + _id, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllTransaction();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        setInProgress(false)
        errorHandler(error)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const toastSuccess = message => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  const handleClickOpen = () => {
    setInProgress(false);
    setDialogTitle("Add New Transaction");
    setDialogType("ADD");
    setOpen(true);
  };

  const handleClose = () => {
    setInProgress(false);
    setDialogTitle("");
    setDialogType("");
    setTransaction(transactionInitData);
    setOpen(false);
  };

  const editTransaction = transaction => {
    setInProgress(false);
    setDialogTitle("Update Transaction");
    setDialogType("EDIT");
    setTransaction(transaction);
    setOpen(true);
  };

  const handleTransactionChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

  const handleTransactionDateChange = date => {
    setTransaction({
      ...transaction,
      date: date,
    });
  };

  const handleSubmit = () => {
    if (transaction._id) {
      updateTransaction();
    } else {
      addTransaction();
    }
  };

  return (
    <>
      <PageTitle
        title="Transactions"
        button="Add New Transaction"
        btnClick={handleClickOpen}
      />
      {error && (
        <ChipButton
          color={"danger"}
          variant="contained"
          style={{ margin: "10px 0", width: "100%" }}
        >
          {error}
        </ChipButton>
      )}
      <AddTransaction
        open={open}
        handleClose={handleClose}
        dialogTitle={dialogTitle}
        handleSubmit={handleSubmit}
        transaction={transaction}
        dialogType={dialogType}
        handleDateChange={handleTransactionDateChange}
        handleChange={handleTransactionChange}
        inProgress={inProgress}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TransactionListTable
            transactionList={transactionList}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
            isLoading={isLoading}
            setTransactionList={setTransactionList}
            copyTransactionList={copyTransactionList}
          />
        </Grid>
      </Grid>
    </>
  );
}
