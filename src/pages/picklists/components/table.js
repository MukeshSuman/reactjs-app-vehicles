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

export default function PicklistsListTable(props) {
  const [open, setOpen] = React.useState(false);
  const [picklist, setPicklists] = React.useState({});
  const [showDateRange, setShowDateRange] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [toDay, setToDay] = React.useState(new Date());

  const {
    picklistList,
    copyPicklistsList,
    setPicklistsList,
    editPicklists,
    deletePicklists,
    isLoading,
  } = props;

  const handleClickOpen = rowData => {
    setPicklists(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPicklists({});
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

  const filterPicklistsList = (filterType, date) => {
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
    const dataList = copyPicklistsList.filter(
      item =>
        new Date(item.date).getTime() >= startDateTime &&
        new Date(item.date).getTime() <= endDateTime,
    );
    if (filterType === "Refresh") {
      setPicklistsList(copyPicklistsList);
    } else {
      setPicklistsList(dataList);
    }
  };

  const actionsName = [
    {
      icon: () => <VisibilityOutlined />,
      tooltip: "Veiw Picklists Details",
      hidden: true,
      onClick: (event, rowData) => {},
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit Picklists Details",
      onClick: (event, rowData) => {
        editPicklists(rowData);
      },
    },
    {
      icon: () => <DeleteOutline />,
      tooltip: "Delete Picklists",
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
            <p>Display Name : {rowData.displayName}</p>
            <p>Value : {rowData.value}</p>
            <p>Type : {rowData.type}</p>
            <p>isActive : {rowData.isActive}</p>
            <p>Rate : {rowData.rate}</p>
            <p>Perent Name : {rowData.perentName}</p>
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
        <DialogTitle id="alert-dialog-title">{"Delete Picklists"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this picklist ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deletePicklists(picklist._id);
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
        title="Picklists List"
        columns={columnsName}
        data={picklistList}
        detailPanel={detailPanel}
        isLoading={isLoading}
        options={{
          exportButton: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50, 100],
          paginationType: "stepped",
        }}
      />
    </div>
  );
}
