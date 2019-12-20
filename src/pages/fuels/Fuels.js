import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { format } from "date-fns";
import axios from "axios";

import { toast } from "react-toastify";

// components
import PageTitle from "../../components/PageTitle";
import AddFuel from "./components/add";
import FuelListTable from "./components/table";
import { Button as ChipButton } from "../../components/Wrappers";

import {
  API_ADD_NEW_FUEL,
  API_GET_ALL_FUELS,
  API_UPDATE_FUEL,
  API_DELETE_FUEL,
} from "../../constants/api";

const fuelInitData = {
  date: new Date(),
  type: "",
  litre: "",
  beforePoint: "",
  availablePoint: "",
  place: "",
  description: "",
}

export default function Fuels() {
  // local
  var [isLoading, setIsLoading] = useState(true);
  // var [isOpen, setIsOpen] = useState(false);
  var [error, setError] = useState(null);
  var [open, setOpen] = React.useState(false);
  var [fuelList, setFuelList] = React.useState([]);
  var [copyFuelList, setCopyFuelList] = React.useState([]);
  var [dialogTitle, setDialogTitle] = React.useState("");
  var [dialogType, setDialogType] = React.useState("");
  var [fuel, setFuel] = React.useState(fuelInitData);
  var [inProgress, setInProgress] = useState(false);


  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };


  useEffect(() => {
    getAllFuel();
  }, []);

  const getAllFuel = () => {
    axios
      .get(API_GET_ALL_FUELS, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        setIsLoading(false);
        let fuelListArray = data.data;
        fuelListArray = fuelListArray.map(fuel => ({
          ...fuel,
          date: format(new Date(fuel.date), "yyyy-MM-dd"),
        }));
        setFuelList(fuelListArray);
        setCopyFuelList(fuelListArray);
      })
      .catch(error => {
        setError("something went wrong please try again")
        setIsLoading(false)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const addFuel = () => {
    setInProgress(true)
    axios
      .post(API_ADD_NEW_FUEL, fuel, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllFuel();
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

  const updateFuel = () => {
    setInProgress(true)
    axios
      .put(API_UPDATE_FUEL + "/" + fuel._id, fuel, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllFuel();
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

  const deleteFuel = _id => {
    axios
      .delete(API_DELETE_FUEL + "/" + _id, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllFuel();
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
    setDialogTitle("Add New Fuel");
    setDialogType("ADD");
    setOpen(true);
  };

  const handleClose = () => {
    setInProgress(false);
    setDialogTitle("");
    setDialogType("");
    setFuel(fuelInitData);
    setOpen(false);
  };

  const editFuel = fuel => {
    setInProgress(false);
    setDialogTitle("Update Fuel");
    setDialogType("EDIT");
    setFuel(fuel);
    setOpen(true);
  };

  const handleFuelChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setFuel({
      ...fuel,
      [name]: value,
    });
  };

  const handleFuelDateChange = date => {
    setFuel({
      ...fuel,
      date: date,
    });
  };

  const handleSubmit = () => {
    if (fuel._id) {
      updateFuel();
    } else {
      addFuel();
    }
  };

  return (
    <>
      {/* <ToastContainer autoClose={5000} /> */}
      <PageTitle
        title="Fuels"
        button="Add New Fuel"
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
      <AddFuel
        open={open}
        handleClose={handleClose}
        dialogTitle={dialogTitle}
        handleSubmit={handleSubmit}
        fuel={fuel}
        dialogType={dialogType}
        handleDateChange={handleFuelDateChange}
        handleChange={handleFuelChange}
        inProgress={inProgress}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FuelListTable
            fuelList={fuelList}
            editFuel={editFuel}
            deleteFuel={deleteFuel}
            isLoading={isLoading}
            setFuelList={setFuelList}
            copyFuelList={copyFuelList}
          />
        </Grid>
      </Grid>
    </>
  );
}
