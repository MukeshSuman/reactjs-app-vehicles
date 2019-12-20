import React, { forwardRef } from "react";

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  VisibilityOutlined,
} from "@material-ui/icons";

import { Button } from "../../../components/Wrappers";

const states = {
  repair: "info",
  maintenance: "secondary",
  "part change": "warning",
  "repair and part change": "primary",
};

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  VisibilityOutlined: forwardRef((props, ref) => (
    <VisibilityOutlined {...props} ref={ref} />
  )),
};

export const columnsName = [
  { title: "Date", field: "date" },
  {
    title: "Maintenance Type",
    field: "maintenanceType",
    render: rowData => (
      <Button
        color={states[rowData.maintenanceType.toLowerCase()]}
        size="small"
        className="px-2"
        variant="contained"
      >
        {rowData.maintenanceType}
      </Button>
    ),
  },
  { title: "Amount", field: "amount" },
  { title: "Labour Charge", field: "labourCharge" },
  { title: "Items Name", field: "itemsName" },
  { title: "Place", field: "place" },
  { title: "Description", field: "description" },
];
