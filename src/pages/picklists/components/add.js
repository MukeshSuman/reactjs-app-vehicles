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
  FormControlLabel,
  Select,
  Switch,
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

export default function AddPicklists(props) {
  const classes = useStyles();

  const {
    open,
    handleClose,
    dialogTitle,
    handleSubmit,
    picklist,
    handleChange,
    handleDateChange,
    inProgress,
  } = props;

  const { displayName, value, type, isActive, rate, perentName } = picklist;

  const save = () => {
    if (!displayName) {
      toastError("Please enter display name");
    } else if (!value) {
      toastError("Please enter value");
    } else if (!type) {
      toastError("Please enter type");
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
          <TextField
            autoFocus
            margin="dense"
            id="displayName"
            label="Display Name"
            type="text"
            name="displayName"
            value={displayName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="value"
            label="Value"
            type="text"
            name="value"
            value={value}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="type"
            label="Type"
            type="text"
            name="type"
            value={type}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="rate"
            label="Rate"
            type="number"
            name="rate"
            value={rate}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={e =>
                  handleChange({
                    target: {
                      name: "isActive",
                      value: e.target.checked,
                    },
                  })
                }
                value={isActive}
              />
            }
            label="isActive"
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
