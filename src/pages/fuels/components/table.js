import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { tableIcons, columnsName } from "./tableHelper";
import DateFnsUtils from "@date-io/date-fns";
import {
  VisibilityOutlined,
  DeleteOutline,
  Edit,
  Today,
  DateRange,
  Refresh,
} from "@material-ui/icons";

import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";


import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { Button as ChipButton } from "../../../components/Wrappers";

export default function FuelListTable(props) {
  const [open, setOpen] = React.useState(false);
  const [fuel, setFuel] = React.useState({});
  const [showDateRange, setShowDateRange] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [toDay, setToDay] = React.useState(new Date());

  const {
    fuelList,
    copyFuelList,
    setFuelList,
    editFuel,
    deleteFuel,
    isLoading,
  } = props;

  const handleClickOpen = rowData => {
    setFuel(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFuel({});
  };

  const getCount = (list, key, value) => {
    const filterList = list.filter(item => item[key] === value);
    return filterList.length;
  };

  const getAmount = (list, key, paymentType, status) => {
    let total = 0;
    list.forEach(item => {
      if (status && item["status"] !== status) {
        return;
      } else if (paymentType && item["paymentType"] !== paymentType) {
        return;
      }
      total += item[key];
    });
    // console.log("total", total);
    return total;
  };

  const filterFuelList = (filterType, date) => {
    let start = new Date();
    let end = new Date();
    if (filterType === "Today") {
      start = new Date();
      end = new Date();
    } else if (filterType === "StartDate") {
      start = new Date(date);
      end = new Date(endDate);
    } else if (filterType === "EndDate") {
      start = new Date(startDate);
      end = new Date(date);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setStartDate(start);
    setEndDate(end);
    const startDateTime = start.getTime();
    const endDateTime = end.getTime();
    const dataList = copyFuelList.filter(
      item =>
        new Date(item.date).getTime() >= startDateTime &&
        new Date(item.date).getTime() <= endDateTime,
    );
    if (filterType === "Refresh") {
      setFuelList(copyFuelList);
    } else {
      setFuelList(dataList);
    }
  };

  const actionsName = [
    {
      icon: () => <VisibilityOutlined />,
      tooltip: "Veiw Fuel Details",
      hidden: true,
      onClick: (event, rowData) => {},
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit Fuel Details",
      onClick: (event, rowData) => {
        editFuel(rowData);
      },
    },
    {
      icon: () => <DeleteOutline />,
      tooltip: "Delete Fuel",
      hidden: true,
      onClick: (event, rowData) => {
        handleClickOpen(rowData);
      },
    },
  ];

  const detailPanel = [
    {
      tooltip: "Show Details",
      render: rowData => {
        return (
          <div style={{ padding: "0 10px" }}>
            <p>Date : {rowData.date}</p>
            <p>Type : {rowData.type}</p>
            <p>Litre : {rowData.litre}</p>
            <p>Before Point : {rowData.beforePoint}</p>
            <p>Available Point : {rowData.availablePoint}</p>
            <p>Place : {rowData.place}</p>
            <p>Description : {rowData.description}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Fuel"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this fuel ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteFuel(fuel._id);
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <MaterialTable
        icons={tableIcons}
        actions={actionsName}
        title="Fuel List"
        columns={columnsName}
        data={fuelList}
        detailPanel={detailPanel}
        isLoading={isLoading}
        options={{
          exportButton: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50, 100],
          paginationType: "stepped",
        }}
        components={{
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: 10 }}>
              <ChipButton
                  color={"success"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {" Filled " + getCount(props.data, "type", "Filled")}
                </ChipButton>
                <ChipButton
                  color={"completed"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Amount " + getAmount(props.data, "amount", null, null)}
                </ChipButton>
              </div>

              <div style={{ padding: 10 }}>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={() => filterFuelList("Today", new Date())}
                >
                  <Today /> {" Today"}
                </ChipButton>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  <DateRange /> {" Range"}
                </ChipButton>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                >
                  <Refresh
                    onClick={() => filterFuelList("Refresh", new Date())}
                  />
                </ChipButton>
              </div>
              {showDateRange && (
                <div style={{ padding: 10 }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                          margin="dense"
                          id="start-date-picker-dialog"
                          label="Start Date"
                          format="dd/MM/yyyy"
                          value={startDate}
                          onChange={date => filterFuelList("StartDate", date)}
                          name="date"
                          fullWidth
                          KeyboardButtonProps={{
                            name: "date",
                            "aria-label": "start date",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                          margin="dense"
                          id="end-date-picker-dialog"
                          label="End Date"
                          format="dd/MM/yyyy"
                          value={endDate}
                          onChange={date => filterFuelList("EndDate", date)}
                          name="date"
                          fullWidth
                          KeyboardButtonProps={{
                            name: "date",
                            "aria-label": "end date",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
}
