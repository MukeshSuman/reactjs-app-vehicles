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
  DialogContentText,
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

export default function MaintenanceListTable(props) {
  const [open, setOpen] = React.useState(false);
  const [maintenance, setMaintenance] = React.useState({});
  const [showDateRange, setShowDateRange] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [toDay, setToDay] = React.useState(new Date());

  const {
    maintenanceList,
    copyMaintenanceList,
    setMaintenanceList,
    editMaintenance,
    deleteMaintenance,
    isLoading,
  } = props;

  const handleClickOpen = rowData => {
    setMaintenance(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMaintenance({});
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

  const filterMaintenanceList = (filterType, date) => {
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
    const dataList = copyMaintenanceList.filter(
      item =>
        new Date(item.date).getTime() >= startDateTime &&
        new Date(item.date).getTime() <= endDateTime,
    );
    if (filterType === "Refresh") {
      setMaintenanceList(copyMaintenanceList);
    } else {
      setMaintenanceList(dataList);
    }
  };

  const actionsName = [
    {
      icon: () => <VisibilityOutlined />,
      tooltip: "Veiw Maintenance Details",
      hidden: true,
      onClick: (event, rowData) => {},
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit Maintenance Details",
      onClick: (event, rowData) => {
        editMaintenance(rowData);
      },
    },
    {
      icon: () => <DeleteOutline />,
      tooltip: "Delete Maintenance",
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
            <p>Maintenance Type : {rowData.maintenanceType}</p>
            <p>Amount : {rowData.amount}</p>
            <p>Labour Charge : {rowData.labourCharge}</p>
            <p>Items Name : {rowData.itemsName}</p>
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
        <DialogTitle id="alert-dialog-title">
          {"Delete Maintenance"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this maintenance ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteMaintenance(maintenance._id);
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
        title="Maintenance List"
        columns={columnsName}
        data={maintenanceList}
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
                  {"Amount " + getAmount(props.data, "amount", null, null)}
                </ChipButton>
              </div>

              <div style={{ padding: 10 }}>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={() => filterMaintenanceList("Today", new Date())}
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
                    onClick={() => filterMaintenanceList("Refresh", new Date())}
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
                          onChange={date =>
                            filterMaintenanceList("StartDate", date)
                          }
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
                          onChange={date =>
                            filterMaintenanceList("EndDate", date)
                          }
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
