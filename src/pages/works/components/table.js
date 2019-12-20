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

const states = {
  completed: "success",
  pending: "warning",
  declined: "secondary",
};

export default function WorkListTable(props) {
  const [open, setOpen] = React.useState(false);
  const [work, setWork] = React.useState({});
  const [showDateRange, setShowDateRange] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [toDay, setToDay] = React.useState(new Date());

  const {
    workList,
    copyWorkList,
    setWorkList,
    editWork,
    deleteWork,
    isLoading,
  } = props;

  const handleClickOpen = rowData => {
    setWork(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setWork({});
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
    return total;
  };

  const filterWorkList = (filterType, date) => {
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
    const dataList = copyWorkList.filter(
      item =>
        new Date(item.date).getTime() >= startDateTime &&
        new Date(item.date).getTime() <= endDateTime,
    );
    if (filterType === "Refresh") {
      setWorkList(copyWorkList);
    } else {
      setWorkList(dataList);
    }
  };

  const actionsName = [
    {
      icon: () => <VisibilityOutlined />,
      tooltip: "Veiw Work Details",
      hidden: true,
      onClick: (event, rowData) => {},
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit Work Details",
      onClick: (event, rowData) => {
        editWork(rowData);
      },
    },
    {
      icon: () => <DeleteOutline />,
      tooltip: "Delete Work",
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
            <p>Name : {rowData.name}</p>
            <p>Mobile : {rowData.mobile}</p>
            <p>Place : {rowData.place}</p>
            <p>Work Type : {rowData.workType}</p>
            <p>unit : {rowData.unit}</p>
            <p>Unit Type : {rowData.unitType}</p>
            <p>Labour Charge : {rowData.labourCharge}</p>
            <p>Amount : {rowData.amount}</p>
            <p>Paid : {rowData.paid}</p>
            <p>Unpaid : {rowData.unpaid}</p>
            <p>Payment Type : {rowData.paymentType}</p>
            <p>Status : {rowData.status}</p>
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
        <DialogTitle id="alert-dialog-title">{"Delete Work"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this work ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteWork(work._id);
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
        title="Work List"
        columns={columnsName}
        data={workList}
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
                  color={states["completed"]}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Completed " + getCount(props.data, "status", "Completed")}
                </ChipButton>
                <ChipButton
                  color={states["pending"]}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Pending " + getCount(props.data, "status", "Pending")}
                </ChipButton>

                <ChipButton
                  color={states["completed"]}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                 Amount:  {"Cash " +
                    getAmount(props.data, "amount", "Cash", null)}
                  {" Interchange " +
                    getAmount(props.data, "amount", "Interchange", null)}
                  {" NA " + getAmount(props.data, "amount", "NA", null)}
                </ChipButton>
                <ChipButton
                  color={"completed"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Paid " + getAmount(props.data, "paid", "Cash", null)}
                </ChipButton>
                <ChipButton
                  color={"danger"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Unpaid " + getAmount(props.data, "unpaid",  "Cash", "Pending")}
                </ChipButton>
              </div>

              <div style={{ padding: 10 }}>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={() => filterWorkList("Today", new Date())}
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
                    onClick={() => filterWorkList("Refresh", new Date())}
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
                          onChange={date => filterWorkList("StartDate", date)}
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
                          onChange={date => filterWorkList("EndDate", date)}
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
