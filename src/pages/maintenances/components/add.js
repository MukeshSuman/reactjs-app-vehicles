import React  from "react";

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

export default function AddMaintenance(props) {
  const classes = useStyles();

  const {
    open,
    handleClose,
    dialogTitle,
    handleSubmit,
    maintenance,
    handleChange,
    handleDateChange,
    inProgress,
  } = props;

  const {
    date,
    maintenanceType,
    amount,
    labourCharge,
    itemsName,
    place,
    description,
  } = maintenance;

  const save = () => {
    if (!date) {
      toastError("Please select date");
    } else if (!maintenanceType) {
      toastError("Please select maintenance type");
    } else if (!amount) {
      toastError("Please enter amount");
    }  else if (!place) {
      toastError("Please enter place");
    }  else {
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
            <InputLabel id="select-label-maintenanceType">
              Maintenance Type
            </InputLabel>
            <Select
              labelId="select-label-maintenanceType"
              id="maintenanceType"
              value={maintenanceType}
              name="maintenanceType"
              onChange={handleChange}
            >
              <MenuItem value="Repair">Repair</MenuItem>
              <MenuItem value="Part Change">Part Change</MenuItem>
              <MenuItem value="Repair And Part Change">
                Repair And Part Change
              </MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
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
            id="itemsName"
            label="Items Name"
            type="text"
            name="itemsName"
            value={itemsName}
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
