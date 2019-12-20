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

export default function AddFuel(props) {
  const classes = useStyles();

  const {
    open,
    handleClose,
    dialogTitle,
    handleSubmit,
    fuel,
    handleChange,
    handleDateChange,
    inProgress,
  } = props;

  const {
    date,
    amount,
    type,
    litre,
    beforePoint,
    availablePoint,
    place,
    description,
  } = fuel;

  const save = () => {
    if (!date) {
      toastError("Please select date");
    } else if (!type) {
      toastError("Please select type");
    } else if (!beforePoint) {
      toastError("Please enter before point");
    } else if (!availablePoint) {
      toastError("Please enter available point");
    } else if (!place) {
      toastError("Please enter place");
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
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="select-label-type">Type</InputLabel>
            <Select
              labelId="select-label-type"
              id="type"
              label="Type"
              value={type}
              name="type"
              onChange={handleChange}
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Filled">Filled</MenuItem>
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
            id="litre"
            label="Litre"
            type="number"
            name="litre"
            value={litre}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="beforePoint"
            label="Before Point"
            type="number"
            name="beforePoint"
            value={beforePoint}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="availablePoint"
            label="Available Point"
            type="number"
            name="availablePoint"
            value={availablePoint}
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
