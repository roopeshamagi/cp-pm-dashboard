/*eslint-disable*/
import React, { useState, useEffect }from 'react';
import $ from 'jquery';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

var tiledata = [];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));


export default function Table(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = React.useState({

    columns: [

      { title: 'Customer Name', field: 'name' ,editable: 'never'},
      { title: 'Version', field: 'version' ,editable: 'never'},
      { title: 'Upgradable?', field: 'upgradable',lookup: { 0: 'Yes', 1: 'No', 2: 'Not Sure' }},
      { title: 'Remarks', field: 'remarks' ,editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )},
    ],
    data: [
    ],
    job:{},
    jobItem: {},


  });

  useEffect(() => {
          //getUserList();
          getVersionsList();
          
  },[]
);


  function getVersionsList()
  {
    //var url = props.getServerURL() + "serverusage";
    var url = "http://localhost:3006/versions";

    console.log("getDataFromServer URL -->"+url);

    $.ajax({
               url: url,
               type: 'get',
               headers: {  'Access-Control-Allow-Origin': '*' },
               error: function(){
                 console.log("Invalid credentials. Retry!");
               },
               success: function (result) {
                   console.log("result-->"+JSON.stringify(result));
                   if(result.versions.length > 0 )
                   {
                    extractTableData(result.versions);
                  }
                  else{
                    console.log("Invalid response");
                  }
               },
           });
}

  function extractTableData(dataArr)
  {
      var dispArr = [];
      for(let i=0; i<dataArr.length; i++)
      {
          var obj = {};
          obj.name = dataArr[i].name;
          obj.version = dataArr[i].version;
          obj.upgradable = dataArr[i].upgradable;
          obj.remarks = dataArr[i].remarks;
          dispArr.push(obj);
      }

      setState({...state,data:dispArr});
  }
  function updateData(updatedData)
  {

    //updatedData.last_modified = props.getUserDetails().user_id;
    console.log("updated STB: "+JSON.stringify(updatedData));
    //return;

    var url = "http://localhost:3006/updateCustomerDetails";
    console.log("updateData URL -->"+url);

    $.ajax({
               url: url,
               type: 'put',
               dataType: 'json',
               contentType: 'application/json',
               error: function(){
                 console.log("Invalid credentials. Retry!");
               },
               success: function (result) {
                   console.log("updateData Details-->"+JSON.stringify(result));

               },
               data: JSON.stringify(updatedData)
           });
  }

    function handleBack()
    {
      props.showScreen("dashboard");
    }

    function getBackgroundcolor(rowData) {
       var ret;
       if(rowData == 'Not Working' )
        {
         ret = 'maroon';
                           //Delivered
        }
       else if(rowData == 'Closed')
       {
       ret = '#004d00';                      //Closed

       }
       return ret ;

    }

    function getFontcolor(rowData) {


      var ret;
     if(rowData == 'Working')
      {
      ret = 'green';                      //Assigned

      }
      else if(rowData == 'Working with Issues')
      {
      ret = 'GoldenRod';                      //Picked

      }
      else if(rowData == 'Not Tested' )
       {
       ret =  'red';                        //Started

       }
       else if(rowData == 'Not in Scope' )
        {
        ret =  'grey';                        //Delivered

        }
        else if(rowData == 'Not Appplicable' )
         {
         ret =  'darkgrey';                        //Closed

         }
     return ret ;

    }

    function getFontsize() {

      var ret = 15;

      return ret;
    }

  var imgInfo;
  var Job_Image;
  if (tiledata   != null)
  {
      if (tiledata.length >0)
      {
       imgInfo = <GridList className={classes.gridList} cols={2.5}>
         {tiledata.map(tile => (
           <GridListTile key={tile.img}>
             <img src={tile.img} alt={tile.title} />
             <GridListTileBar
               title={tile.title}

             />
           </GridListTile>

          ))}
          </GridList>;
          }
           else {
             imgInfo = <h3> No images Available</h3>;
           }

      }
       else {
         imgInfo = <h4>No images Available</h4>;
       }
      // console.log(".....................................>",state.job.items);
  return (
    <div className="tablecointainer">

    <Dialog open={open} onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
    <DialogTitle id="alert-dialog-title">Job {state.jobItem.job_id} Details</DialogTitle>
    <DialogContent>
      <h3> Vehicle Number : {state.job.vehicle_id}</h3>
      <h3> Date Time : {state.jobItem.start_date}</h3>
      <h3>Images : </h3>
      {imgInfo}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Cancel</Button>
      <Button onClick={handleClose} color="primary" autoFocus>Ok</Button>
    </DialogActions>
  </Dialog>


    <MaterialTable
      title="Cloudport Versions"
      columns={state.columns}
      data={state.data}
      
      options={{
        pageSize:100,
        filtering: true,
        grouping: true,
        exportButton:true,
        exportAllData:true,
       /* actionsCellStyle: {
          color: "#336699"
        },*/
        //cellStyle: rowData => ({backgroundColor: getBackgroundcolor(rowData),color: getFontcolor(rowData), fontSize: getFontsize()}),
        rowStyle: rowData => ({color:getFontcolor(rowData)}),

        headerStyle: { fontSize:16,fontWeight: 'bold',backgroundColor: 'gray', color: "white" },
        searchFieldStyle:{width:500},
        filterCellStyle:{fontSize:10},
  //      cellStyle: { fontSize:15}
      }}

      editable={{

        onRowUpdate: (newData, oldData) =>

          new Promise(resolve => {

            console.log("newData",newData);
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  updateData(newData);

                  console.log("data details",data);

                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        
      }}
    />
    </div>
  );
}
