import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

import "react-toastify/dist/ReactToastify.css";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
// import Typography from "../../pages/typography";
// import Notifications from "../../pages/notifications";
// import Maps from "../../pages/maps";
// import Tables from "../../pages/tables";
import Works from "../../pages/works";
import Fuels from "../../pages/fuels";
import Maintenances from "../../pages/maintenances";
import Transactions from "../../pages/transactions";




// import Icons from "../../pages/icons";
// import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

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
              {/* <Route path="/app/typography" component={Typography} /> */}
              {/* <Route path="/app/tables" component={Tables} /> */}
              <Route path="/app/works" component={Works} />
              <Route path="/app/fuels" component={Fuels} />
              <Route path="/app/maintenances" component={Maintenances} />
              <Route path="/app/transactions" component={Transactions} />
              {/* <Route path="/app/notifications" component={Notifications} /> */}
              {/* <Route path="/app/ui/maps" component={Maps} /> */}
              {/* <Route path="/app/ui/icons" component={Icons} /> */}
              {/* <Route path="/app/ui/charts" component={Charts} /> */}
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
