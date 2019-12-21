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

export default function TransactionListTable(props) {
  const [open, setOpen] = React.useState(false);
  const [transaction, setTransaction] = React.useState({});
  const [showDateRange, setShowDateRange] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [toDay, setToDay] = React.useState(new Date());

  const {
    transactionList,
    copyTransactionList,
    setTransactionList,
    editTransaction,
    deleteTransaction,
    isLoading,
  } = props;

  const handleClickOpen = rowData => {
    setTransaction(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTransaction({});
  };

  const getAmount = (list, key, type, category) => {
    let total = 0;
    list.forEach(item => {
      if (type && item["type"] !== type) {
        return;
      } else if (category && item["category"] !== category) {
        return;
      }
      total += item[key];
    });
    return total;
  };

  const filterTransactionList = (filterType, date) => {
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
    const dataList = copyTransactionList.filter(
      item =>
        new Date(item.date).getTime() >= startDateTime &&
        new Date(item.date).getTime() <= endDateTime,
    );
    if (filterType === "Refresh") {
      setTransactionList(copyTransactionList);
    } else {
      setTransactionList(dataList);
    }
  };

  const actionsName = [
    {
      icon: () => <VisibilityOutlined />,
      tooltip: "Veiw Transaction Details",
      hidden: true,
      onClick: (event, rowData) => {},
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit Transaction Details",
      onClick: (event, rowData) => {
        editTransaction(rowData);
      },
    },
    {
      icon: () => <DeleteOutline />,
      tooltip: "Delete Transaction",
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
            <p>Amount : {rowData.amount}</p>
            <p>Type : {rowData.type}</p>
            <p>Name : {rowData.name}</p>
            <p>Category : {rowData.category}</p>
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
          {"Delete Transaction"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this transaction ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteTransaction(transaction._id);
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
        title="Transaction List"
        columns={columnsName}
        data={transactionList}
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
                  color={"secondary"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Debited " +
                    getAmount(props.data, "amount", "Debited", null)}
                </ChipButton>
                <ChipButton
                  color={"success"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Credited " +
                    getAmount(props.data, "amount", "Credited", null)}
                </ChipButton>
                <ChipButton
                  color={"interchange"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Interchange " +
                    getAmount(props.data, "amount", "Interchange", null)}
                </ChipButton>
                <ChipButton
                  color={"na"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Na " + getAmount(props.data, "amount", "NA", null)}
                </ChipButton>
                <ChipButton
                  color={"cash"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Work " + getAmount(props.data, "amount", "Credited", "Work")}
                </ChipButton>
                <ChipButton
                  color={"completed"}
                  size="small"
                  className="px-2"
                  variant="contained"
                  style={{ margin: 5 }}
                >
                  {"Balance " +
                    (getAmount(props.data, "amount", "Credited", null) -
                      getAmount(props.data, "amount", "Debited", null))}
                </ChipButton>
              </div>

              <div style={{ padding: 10 }}>
                <ChipButton
                  color={"primary"}
                  variant="contained"
                  style={{ marginRight: 5 }}
                  onClick={() => filterTransactionList("Today", new Date())}
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
                    onClick={() => filterTransactionList("Refresh", new Date())}
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
                            filterTransactionList("StartDate", date)
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
                            filterTransactionList("EndDate", date)
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
