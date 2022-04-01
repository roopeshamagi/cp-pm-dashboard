/*eslint-disable*/
import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const styles = {
  mainContainer: {display:'flex',
    flexDirection:'column',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    //height: clientHeight,
    width:'100%',
    //borderWidth: 1,
    //borderStyle: 'solid',
    //borderColor: 'red',
  },
  actionContainer:{
    display:'flex',
    flexDirection:'row',
    flexWrap:'nowrap',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'stretch',
    width:'100%',
  },
  flexItem:{
    order:0,
    flex:'0 1 auto',
    alignSelf:'auto',
    height: 280,
    width: 280,
  },
  mainDivStyle:{
    textAlign:'center'
  },
  selectFieldLabelStyle: {
    textAlign: 'left'
  },
  stylePaper:{
    
    height: 140,
    width: 140,
    margin: 40,
    textAlign: 'center',
    display: 'inline-block',
  },
  styleImage:{
    
    height: 200,
    width: 200,
    margin: 20,
    textAlign: 'center',
    
  },
  styleTemp:{

  },
};

class Dashboard extends React.Component{

  constructor(props){
    super(props)
    this.state = {

    }
    
    this.handleCloudportVersions = this.handleCloudportVersions.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleAccountsTracker = this.handleAccountsTracker.bind(this);
  }

  handleStrings()
  {
    this.props.showScreen("strings");
  }
  handleCaptureCards()
  {
    this.props.showScreen("capturecards");
  }
  
  handlePerformanceTests()
  {
      this.props.showScreen("performanceTests");
  }
  handleCloudportVersions()
  {
    this.props.showScreen("cloudportVersions");
  }
  handleChangePassword()
  {
    this.props.showScreen("changePassword");
  }
  handleBack()
  {
    this.props.showScreen("login");
  }
  handleAccountsTracker()
  {
    this.props.showScreen("AccountsTable");

  }
  handleCloudportVersionsAge()
  {
    this.props.showScreen("AccountsTable");
  }
  
  render() {


    return(

        <div className="mainCointainer" style={styles.mainContainer}>
        <h1 style ={{color:'steelblue'}}>Amagi Cloudport Dashboard</h1>
          <div className="cointainer" style={styles.actionContainer}>
            <Button onClick={this.handleCloudportVersions} variant="outlined" color="primary">
                Version Tracker
            </Button>
            <Button onClick={this.handleCloudportVersionsAge} variant="outlined" color="primary">
                Version Age
            </Button>
            <Button onClick={this.handleAccountsTracker} variant="outlined" color="primary">
                Account Tracker
            </Button>
          </div>
        </div>

    );
  }


}
export default Dashboard;
