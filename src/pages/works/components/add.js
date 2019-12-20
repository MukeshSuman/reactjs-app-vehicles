import React from "react";

import {
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  InputLabel,
  makeStyles,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";

import { toast } from "react-toastify";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(10),
  },
  submitLoader: {
    marginLeft: theme.spacing(4),
  },
}));

export default function AddWork(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    dialogTitle,
    handleSubmit,
    work,
    handleChange,
    handleDateChange,
    inProgress,
  } = props;

  const {
    date,
    name,
    mobile,
    place,
    workType,
    unit,
    unitType,
    labourCharge,
    amount,
    paid,
    unpaid,
    paymentType,
    status,
    description,
  } = work;

  const save = () => {
    if (!date) {
      toastError("Please select date");
    } else if (!workType) {
      toastError("Please select work type");
    } else if (!unitType) {
      toastError("Please select unit type");
    } else if (!paymentType) {
      toastError("Please select payment type");
    } else if (!status) {
      toastError("Please select status");
    } else if (!unit) {
      toastError("Please enter unit");
    } else if (!amount) {
      toastError("Please enter amount");
    } else {
      handleSubmit();
    }
  };

  const toastError = message => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="dense"
                id="date-picker-dialog"
                label="Date"
                format="dd/MM/yyyy"
                value={date}
                onChange={handleDateChange}
                name="date"
                fullWidth
                KeyboardButtonProps={{
                  name: "date",
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="mobile"
            label="Mobile"
            type="number"
            name="mobile"
            value={mobile}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="place"
            label="Place"
            type="text"
            name="place"
            value={place}
            onChange={handleChange}
            fullWidth
          />
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-workType">Work Type</InputLabel>
            <Select
              labelId="select-label-workType"
              id="workType"
              value={workType}
              name="workType"
              onChange={handleChange}
            >
              <MenuItem value="Trolley Soil">Trolley Soil</MenuItem>
              <MenuItem value="Paddy Thresher">Paddy Thresher</MenuItem>
              <MenuItem value="Wheat Thresher">Wheat Thresher</MenuItem>
              <MenuItem value="Cultivator">Cultivator</MenuItem>
              <MenuItem value="Rotavator">Rotavator</MenuItem>
              <MenuItem value="Shipping">Shipping</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-unitType">Unit Type</InputLabel>
            <Select
              labelId="select-label-unitType"
              id="unitType"
              value={unitType}
              name="unitType"
              onChange={handleChange}
            >
              <MenuItem value="Minute">Minute</MenuItem>
              <MenuItem value="Kilometre">Kilometre</MenuItem>
              <MenuItem value="Trip">Trip</MenuItem>
              <MenuItem value="Kattha">Kattha</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="unit"
            label="Unit"
            type="number"
            name="unit"
            value={unit}
            onChange={handleChange}
            fullWidth
          />
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-paymentType">Payment Type</InputLabel>
            <Select
              labelId="select-label-paymentType"
              id="paymentType"
              value={paymentType}
              name="paymentType"
              onChange={handleChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Interchange">Interchange</MenuItem>
              <MenuItem value="NA">NA</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            name="amount"
            value={amount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="paid"
            label="Paid"
            type="number"
            name="paid"
            value={paid}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="unpaid"
            label="Unpaid"
            type="number"
            name="unpaid"
            value={unpaid}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="labourCharge"
            label="Labour Charge"
            name="labourCharge"
            type="number"
            value={labourCharge}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            fullWidth
          />
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-status">Status</InputLabel>
            <Select
              labelId="select-label-status"
              id="status"
              value={status}
              name="status"
              onChange={handleChange}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {inProgress ? (
            <CircularProgress size={26} className={classes.submitLoader} />
          ) : (
            <div>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={() => save()} color="primary">
                Save
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
