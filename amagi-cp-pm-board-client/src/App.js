/*eslint-disable*/
import React from 'react';
import './App.css';
import Dashboard from './dashboard.js';
import AccountsTable from './AccountsTable.js';
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

       case "dashboard":
       displayPage = <Dashboard showScreen={this.showScreen} getUserDetails = {this.getUserDetails}/>;
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
