import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];


class Dashboard extends Component {
  state = { 
    focused: null,  //null = unfocused four panel view  // id# = focused
    loading: true,
    days: [],
    appointments: {},
    interviewers: {}
  }
  //the selectPanel instance method
  selectPanel(id) {
    this.setState(previousState => ({   //this is the Dashboard instance
      focused: previousState.focused !== null ? null : id      //Now when we call this.setState it will be the setState method of the Dashboard component.
    }));
   }

   componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
   
  render() {
    // console.log(this.state)  //The first line of output comes from the render during the mount phase. The second line is a result of the update phase calling render again
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {  //We are using this.setState to apply state changes. It is an instance method provided by the React.Component superclass.
      return <Loading />;
    }
    console.log(this.state) //only see the second output once the data is loaded.
    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
   .map(panel => (
    <Panel
     key={panel.id}
     id={panel.id}
     label={panel.label}
     value={panel.getValue(this.state)}
     onSelect={event => this.selectPanel(panel.id)}
    />
   ));
    
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
