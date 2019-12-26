import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";

import "react-toastify/dist/ReactToastify.css";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Works from "../../pages/works";
import Fuels from "../../pages/fuels";
import Maintenances from "../../pages/maintenances";
import Transactions from "../../pages/transactions";
import Picklists from "../../pages/picklists";

// context
import { useLayoutState } from "../../context/LayoutContext";

import jwt from "jsonwebtoken";

const SECRET = "SECRETSTRING";
const user = jwt.decode(localStorage.getItem("token"), SECRET);

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  const isSuperAdmin = user && user.adminType === "superAdmin";

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/works" component={Works} />
            <Route path="/app/fuels" component={Fuels} />
            <Route path="/app/maintenances" component={Maintenances} />
            {isSuperAdmin && (
              <div>
                <Route path="/app/transactions" component={Transactions} />
                <Route path="/app/picklists" component={Picklists} />
              </div>
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
