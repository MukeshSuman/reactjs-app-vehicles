import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { format } from "date-fns";
import axios from "axios";


import { toast } from "react-toastify";

// components
import PageTitle from "../../components/PageTitle";
import AddWork from "./components/add";
import WorkListTable from "./components/table";
import { Button as ChipButton } from "../../components/Wrappers";

import {
  API_ADD_NEW_WORK,
  API_GET_ALL_WORKS,
  API_UPDATE_WORK,
  API_DELETE_WORK,
} from "../../constants/api";

const workInitData = {
  date: new Date(),
  name: "",
  mobile: "",
  place: "",
  workType: "",
  unit: "",
  unitType: "",
  labourCharge: "",
  amount: "",
  paid: "",
  unpaid: "",
  paymentType: "",
  status: "",
  description: "",
}

export default function Works() {
  // local
  var [isLoading, setIsLoading] = useState(true);
  // var [isOpen, setIsOpen] = useState(false);
  var [error, setError] = useState(null);
  var [open, setOpen] = React.useState(false);
  var [workList, setWorkList] = React.useState([]);
  var [copyWorkList, setCopyWorkList] = React.useState([]);
  var [dialogTitle, setDialogTitle] = React.useState("");
  var [dialogType, setDialogType] = React.useState("");
  var [work, setWork] = React.useState(workInitData);
  var [inProgress, setInProgress] = useState(false);


  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };


  useEffect(() => {
    getAllWork();
  }, []);

  const getAllWork = () => {
    axios
      .get(API_GET_ALL_WORKS, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        setIsLoading(false);
        let workListArray = data.data;
        workListArray = workListArray.map(work => ({
          ...work,
          date: format(new Date(work.date), "yyyy-MM-dd"),
        }));
        setWorkList(workListArray);
        setCopyWorkList(workListArray);
      })
      .catch(error => {
        setError("something went wrong please try again")
        setIsLoading(false)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const addWork = () => {
    setInProgress(true);
    axios
      .post(API_ADD_NEW_WORK, work, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllWork();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        toastError(error);
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const updateWork = () => {
    setInProgress(true);
    axios
      .put(API_UPDATE_WORK + "/" + work._id, work, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllWork();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        console.log(`😱 Axios request failed: ${error}`);
        toastError(error);
      });
  };

  const deleteWork = _id => {
    axios
      .delete(API_DELETE_WORK + "/" + _id, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllWork();
        if (data.success) {
          handleClose();
          toastSuccess(data.message);
        }
      })
      .catch(error => {
        toastError(error);
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const toastError = message => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  const toastSuccess = message => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  const handleClickOpen = () => {
    setInProgress(false);
    setDialogTitle("Add New Work");
    setDialogType("ADD");
    setOpen(true);
  };

  const handleClose = () => {
    setInProgress(false);
    setDialogTitle("");
    setDialogType("");
    setWork(workInitData);
    setOpen(false);
  };

  const editWork = work => {
    setInProgress(false);
    setDialogTitle("Update Work");
    setDialogType("EDIT");
    setWork(work);
    setOpen(true);
  };

  const handleWorkChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setWork({
      ...work,
      [name]: value,
    });
  };

  const handleWorkDateChange = date => {
    setWork({
      ...work,
      date: date,
    });
  };

  const handleSubmit = () => {
    if (work._id) {
      updateWork();
    } else {
      addWork();
    }
  };

  return (
    <>
      <PageTitle
        title="Works"
        button="Add New Work"
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
      <AddWork
        open={open}
        handleClose={handleClose}
        dialogTitle={dialogTitle}
        handleSubmit={handleSubmit}
        work={work}
        dialogType={dialogType}
        handleDateChange={handleWorkDateChange}
        handleChange={handleWorkChange}
        inProgress={inProgress}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <WorkListTable
            workList={workList}
            editWork={editWork}
            deleteWork={deleteWork}
            isLoading={isLoading}
            setWorkList={setWorkList}
            copyWorkList={copyWorkList}
          />
        </Grid>
      </Grid>
    </>
  );
}
