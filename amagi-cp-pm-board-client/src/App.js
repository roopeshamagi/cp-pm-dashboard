/*eslint-disable*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './login.js';
import ChangePassword from './setpassword.js';
import Dashboard from './dashboard.js';
import ServerAllocation from './ServerAllocation.js';
import ServerAllocationTable from './ServerAllocationTable.js';
import RemoteReboot from './RemoteReboot.js';
import IssueTracker from './IssueTracker.js';
import PickupandDropJobTable from './PickupandDropJobTable.js';
import StringsTable from './StringsTable.js';
import AccountsTable from './AccountsTable.js';
import CaptureCards from './CaptureCards.js';
import Chart from './VersionCharts.js';

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isShowLogInPage: true,
    screenName:"dashboard",
    userDetails:""
    }

  this.showScreen = this.showScreen.bind(this);
  this.getUserDetails = this.getUserDetails.bind(this);
  this.setUserDetails = this.setUserDetails.bind(this);
  this.getServerURL = this.getServerURL.bind(this);
  }
  
  getServerURL()
  {
    return "http://127.0.0.1:3006/";
    //return "http://54.245.191.20:8686/";
  }
  getUserDetails()
  {
    return this.state.userDetails;
  }

  setUserDetails(userObj)
  {
    this.setState({userDetails:userObj.user});
  }

  showScreen(screenName)
  {
    this.setState({screenName:screenName});
  }

   render() {
     var displayPage;
     switch (this.state.screenName)
     {

       case "login":
       displayPage = <LogIn showScreen={this.showScreen} setUserDetails = {this.setUserDetails} getServerURL={this.getServerURL}/>;
       break;
       case "dashboard":
       displayPage = <Dashboard showScreen={this.showScreen} getUserDetails = {this.getUserDetails}/>;
       break;
       case "changePassword":
       displayPage = <ChangePassword showScreen={this.showScreen} getUserDetails={this.getUserDetails} getServerURL={this.getServerURL}/>;
       break;
       case "cloudportVersions":
       displayPage = <Chart showScreen={this.showScreen}/>;
       break;
       case "AccountsTable":
        displayPage = <AccountsTable showScreen={this.showScreen} getUserDetails={this.getUserDetails} getServerURL={this.getServerURL}/>;
        break;
     }
      return (
         <div>
     {displayPage}


         </div>
      );
   }
}

export default App;