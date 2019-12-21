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

export default function AddTransaction(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    dialogTitle,
    handleSubmit,
    transaction,
    handleChange,
    handleDateChange,
    inProgress,
  } = props;

  const { date, name, type, amount, category, description } = transaction;

  const save = () => {
    if (!date) {
      toastError("Please select date");
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

  const getMenuItem = key => {
    let menuItem = [];
    const categoryForDebited = [
      "Worker",
      "Fuel",
      "Maintenance",
      "Withdrawn",
      "Salary",
    ];
    const categoryForCredited = ["Daily", "Deposited", "Advance"];
    if (key === "Type") {
      const tempArr = ["Debited", "Credited"];
      menuItem = tempArr.map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>);
    }
    if (key === "Category") {
      if (type === "Debited") {
        menuItem = categoryForDebited.map((item, index) => (
          <MenuItem key={index} value={item}>{item}</MenuItem>
        ));
      } else if (type === "Credited") {
        menuItem = categoryForCredited.map((item, index) => (
          <MenuItem key={index} value={item}>{item}</MenuItem>
        ));
      } else {
        const tempArr = [...categoryForCredited, ...categoryForDebited];
        menuItem = tempArr.map((item, index) => (
          <MenuItem key={index} value={item}>{item}</MenuItem>
        ));
      }
    }

    return menuItem;
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
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-type">Type</InputLabel>
            <Select
              labelId="select-label-type"
              id="type"
              value={type}
              name="type"
              onChange={handleChange}
            >
              {getMenuItem("Type")}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-category">Category</InputLabel>
            <Select
              labelId="select-label-category"
              id="category"
              value={category}
              name="category"
              onChange={handleChange}
            >
              {getMenuItem("Category")}
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
            id="description"
            label="Description"
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            fullWidth
          />
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
