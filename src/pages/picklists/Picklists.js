import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { format } from "date-fns";
import axios from "axios";


import { toast } from "react-toastify";

import { errorHandler } from '../../handler';


// components
import PageTitle from "../../components/PageTitle";
import AddPicklists from "./components/add";
import PicklistsListTable from "./components/table";
import { Button as ChipButton } from "../../components/Wrappers";

import {
  API_ADD_NEW_PICKLIST,
  API_GET_ALL_PICKLISTS,
  API_UPDATE_PICKLIST,
  API_DELETE_PICKLIST,
} from "../../constants/api";

const picklistInitData = {
  displayName: '',
  value: "",
  type: "",
  isActive: true,
  rate: 0,
  perentName: "",
}

export default function Picklists() {
  // local
  var [isLoading, setIsLoading] = useState(true);
  // var [isOpen, setIsOpen] = useState(false);
  var [error, setError] = useState(null);
  var [open, setOpen] = React.useState(false);
  var [picklistList, setPicklistsList] = React.useState([]);
  var [copyPicklistsList, setCopyPicklistsList] = React.useState([]);
  var [dialogTitle, setDialogTitle] = React.useState("");
  var [dialogType, setDialogType] = React.useState("");
  var [picklist, setPicklists] = React.useState(picklistInitData);
  var [inProgress, setInProgress] = useState(false);


  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };


  useEffect(() => {
    getAllPicklists();
  }, []);

  const getAllPicklists = () => {
    axios
      .get(API_GET_ALL_PICKLISTS, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        setIsLoading(false);
        let picklistListArray = data.data;
        picklistListArray = picklistListArray.map(picklist => ({
          ...picklist,
          createdAt: format(new Date(picklist.createdAt), "yyyy-MM-dd"),
          updatedAt: format(new Date(picklist.updatedAt), "yyyy-MM-dd"),
        }));
        setPicklistsList(picklistListArray);
        setCopyPicklistsList(picklistListArray);
      })
      .catch(error => {
        setError(errorHandler(error))
        setIsLoading(false)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const addPicklists = () => {
    setInProgress(true);
    axios
      .post(API_ADD_NEW_PICKLIST, picklist, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllPicklists();
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

  const updatePicklists = () => {
    setInProgress(true);
    axios
      .put(API_UPDATE_PICKLIST + "/" + picklist._id, picklist, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllPicklists();
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

  const deletePicklists = _id => {
    setInProgress(true)
    axios
      .delete(API_DELETE_PICKLIST + "/" + _id, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllPicklists();
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
    setDialogTitle("Add New Picklists");
    setDialogType("ADD");
    setOpen(true);
  };

  const handleClose = () => {
    setDialogTitle("");
    setDialogType("");
    setPicklists(picklistInitData);
    setInProgress(false);
    setOpen(false);
  };

  const editPicklists = picklist => {
    setDialogTitle("Update Picklists");
    setDialogType("EDIT");
    setInProgress(false);
    setPicklists(picklist);
    setOpen(true);
  };

  const handlePicklistsChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setPicklists({
      ...picklist,
      [name]: value,
    });
  };

  const handlePicklistsDateChange = date => {
    setPicklists({
      ...picklist,
      date: date,
    });
  };

  const handleSubmit = () => {
    if (picklist._id) {
      updatePicklists();
    } else {
      addPicklists();
    }
  };

  return (
    <>
      <PageTitle
        title="Picklists"
        button="Add New Picklists"
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
      <AddPicklists
        open={open}
        handleClose={handleClose}
        dialogTitle={dialogTitle}
        handleSubmit={handleSubmit}
        picklist={picklist}
        dialogType={dialogType}
        handleDateChange={handlePicklistsDateChange}
        handleChange={handlePicklistsChange}
        inProgress={inProgress}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PicklistsListTable
            picklistList={picklistList}
            editPicklists={editPicklists}
            deletePicklists={deletePicklists}
            isLoading={isLoading}
            setPicklistsList={setPicklistsList}
            copyPicklistsList={copyPicklistsList}
          />
        </Grid>
      </Grid>
    </>
  );
}
