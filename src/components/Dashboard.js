import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];


class Dashboard extends Component {
  state = { 
    focused: null,  //null = unfocused four panel view  // id# = focused
    loading: false
  }
  //the selectPanel instance method
  selectPanel(id) {
    this.setState({   //this is the Dashboard instance
     focused: id      //Now when we call this.setState it will be the setState method of the Dashboard component.
    });
   }
   

  render() {

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {  //We are using this.setState to apply state changes. It is an instance method provided by the React.Component superclass.
      return <Loading />;
    }
    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
   .map(panel => (
    <Panel
     key={panel.id}
     id={panel.id}
     label={panel.label}
     value={panel.value}
     onSelect={event => this.selectPanel(panel.id)}
    />
   ));
    
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
