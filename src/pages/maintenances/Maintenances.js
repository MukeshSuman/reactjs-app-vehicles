import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { format } from "date-fns";
import axios from "axios";


import { toast } from "react-toastify";

// components
import PageTitle from "../../components/PageTitle";
import AddMaintenance from "./components/add";
import MaintenanceListTable from "./components/table";
import { Button as ChipButton } from "../../components/Wrappers";

import {
  API_ADD_NEW_MAINTENANCE,
  API_GET_ALL_MAINTENANCES,
  API_UPDATE_MAINTENANCE,
  API_DELETE_MAINTENANCE,
} from "../../constants/api";

const maintenanceInitData = {
  date: new Date(),
  place: "",
  maintenanceType: "",
  amount: "",
  labourCharge: "",
  description: "",
}

export default function Maintenances() {
  // local
  var [isLoading, setIsLoading] = useState(true);
  // var [isOpen, setIsOpen] = useState(false);
  var [error, setError] = useState(null);
  var [open, setOpen] = React.useState(false);
  var [maintenanceList, setMaintenanceList] = React.useState([]);
  var [copyMaintenanceList, setCopyMaintenanceList] = React.useState([]);
  var [dialogTitle, setDialogTitle] = React.useState("");
  var [dialogType, setDialogType] = React.useState("");
  var [maintenance, setMaintenance] = React.useState(maintenanceInitData);
  var [inProgress, setInProgress] = useState(false);


  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };


  useEffect(() => {
    getAllMaintenance();
  }, []);

  const getAllMaintenance = () => {
    axios
      .get(API_GET_ALL_MAINTENANCES, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        setIsLoading(false);
        let maintenanceListArray = data.data;
        maintenanceListArray = maintenanceListArray.map(maintenance => ({
          ...maintenance,
          date: format(new Date(maintenance.date), "yyyy-MM-dd"),
        }));
        setMaintenanceList(maintenanceListArray);
        setCopyMaintenanceList(maintenanceListArray);
      })
      .catch(error => {
        setError("something went wrong please try again")
        setIsLoading(false)
        console.log(`😱 Axios request failed: ${error}`);
      });
  };

  const addMaintenance = () => {
    setInProgress(true);
    axios
      .post(API_ADD_NEW_MAINTENANCE, maintenance, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllMaintenance();
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

  const updateMaintenance = () => {
    setInProgress(true);
    axios
      .put(API_UPDATE_MAINTENANCE + "/" + maintenance._id, maintenance, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllMaintenance();
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

  const deleteMaintenance = _id => {
    axios
      .delete(API_DELETE_MAINTENANCE + "/" + _id, {
        headers: headers,
      })
      .then(res => res.data)
      .then(data => {
        getAllMaintenance();
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
    setDialogTitle("Add New Maintenance");
    setDialogType("ADD");
    setOpen(true);
  };

  const handleClose = () => {
    setDialogTitle("");
    setDialogType("");
    setMaintenance(maintenanceInitData);
    setInProgress(false);
    setOpen(false);
  };

  const editMaintenance = maintenance => {
    setDialogTitle("Update Maintenance");
    setDialogType("EDIT");
    setInProgress(false);
    setMaintenance(maintenance);
    setOpen(true);
  };

  const handleMaintenanceChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setMaintenance({
      ...maintenance,
      [name]: value,
    });
  };

  const handleMaintenanceDateChange = date => {
    setMaintenance({
      ...maintenance,
      date: date,
    });
  };

  const handleSubmit = () => {
    if (maintenance._id) {
      updateMaintenance();
    } else {
      addMaintenance();
    }
  };

  return (
    <>
      <PageTitle
        title="Maintenances"
        button="Add New Maintenance"
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
      <AddMaintenance
        open={open}
        handleClose={handleClose}
        dialogTitle={dialogTitle}
        handleSubmit={handleSubmit}
        maintenance={maintenance}
        dialogType={dialogType}
        handleDateChange={handleMaintenanceDateChange}
        handleChange={handleMaintenanceChange}
        inProgress={inProgress}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MaintenanceListTable
            maintenanceList={maintenanceList}
            editMaintenance={editMaintenance}
            deleteMaintenance={deleteMaintenance}
            isLoading={isLoading}
            setMaintenanceList={setMaintenanceList}
            copyMaintenanceList={copyMaintenanceList}
          />
        </Grid>
      </Grid>
    </>
  );
}
