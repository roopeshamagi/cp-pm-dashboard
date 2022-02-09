 /* eslint-disable */
import React, {Component} from 'react';
import { Line, Bar, Pie ,Doughnut, HorizontalBar ,Radar} from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import $ from 'jquery';

import ShowChartIcon from '@material-ui/icons/ShowChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import TimelineIcon from '@material-ui/icons/Timeline';
import TableIcon from '@material-ui/icons/TableChart';
import 'chartjs-plugin-datalabels';
import _ from 'underscore';
import VersionTable from './VersionsTable.js';

const maincointainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height:'630px',
  width:'1050px',
  marginLeft: '10rem',
  marginTop: '-2rem',
  flexDirection:'column',
  border:'1px solid grey',
  backgroundColor:'GhostWhite',
}


const optionCointainer = {
  display: 'flex',
  justifyContent: 'space-around',

}

const selectoptionCointainer = {
  display: 'flex',
  justifyContent: 'space-around',
  width:'350px',
  marginLeft: '-5rem',

}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}


const versions = [];
// const months = [{ "id":0,"name":"January"},{ "id":1,"name":"February"}, { "id":2,"name":"March"}, { "id":3,"name":"April"}, { "id":4,"name":"May"},
//  {"id":5,"name":"June"},{ "id":6,"name":"July"}, { "id":7,"name":"August"},
// { "id":8,"name":"September"},{ "id":9,"name":"October"},{ "id":10,"name":"November"},{ "id":11,"name":"December"}];

const years = ['2020', '2021', '2022', '2023', '2024', '2025','2026', '2027', '2028', '2029', '2030'];

const arrFilterBy = ['Date','Drivers'];

class Chart extends Component{

  constructor(props){
    super(props);

    this.state = {
      chartData:{},
      selectedMonth:'',
      selectedYear:'',
      startDate:'',
      endDate:'',
      allJobs:[],
      labels:[],
      label:'',
      data:[],
      disabled : false,
      startMonth : 0,
      endMonth : 11,
      displayMode:"By Month",
      value:6,
      filterBy:'Date',
      driversList:[],
      jobCount:0,
      totalCount:0

    }
    //  this.getChartData = this.getChartData.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleChartType = this.handleChartType.bind(this);
    this.LineChart = this.LineChart.bind(this);
    this.BarChart = this.BarChart.bind(this);
    this.PieChart = this.PieChart.bind(this);
    this.HorizontalChart = this.HorizontalChart.bind(this);
    this.DonutChart = this.DonutChart.bind(this);
    this.RadarChart = this.RadarChart.bind(this);
    this.ShowVersionTable = this.ShowVersionTable.bind(this);
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',

  }
  componentWillMount(){
        this.getChartData();
  }
  

  getChartData(){
    var temp_this = this;
    var url = "http://localhost:3006/versions";
    ////console.log("getDataFromServer URL -->"+url);

    $.ajax({
               url: url,
               type: 'get',
               error: function(){
                 ////console.log("Invalid credentials. Retry!");
               },
               success: function (result) {
                   console.log("versions-->"+JSON.stringify(result));
                   result = _.sortBy(result,'version');
                   var counter = _.countBy(result,'version');
                   var size = _.size(counter);
                   //console.log();
                   console.log(counter);
                   console.log();
                   console.log("-----------")
                   var chart =  temp_this.setState({
                     totalCount:result.length,
                    chartData:{
                      labels: _.keys(counter),
                      datasets:[
                        {
                          label:"version",
                          data:_.values(counter),
                          backgroundColor:[
                            'rgba(255, 99, 132, 0.6)',  'rgba(54, 162, 235, 0.6)',  'rgba(255, 206, 86, 0.6)',   'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',  'rgb(255, 100, 0)',          'rgb(255, 255, 0)',
                            'rgba(104, 162, 235, 0.6)', 'rgb(218, 165, 32)',        'rgba(54, 162, 235, 0.6)',   'rgb(250,235,215)',
                            'rgba(75, 192, 192, 0.6)',  'rgba(153, 102, 255, 0.6)', 'rgb(255, 0, 191)',          'rgb(0,128,128)',
                            'rgb(106,90,205)',          'rgb(135,206,235)',         'rgba(255, 99, 132, 0.6)',   'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',  'rgba(75, 192, 192, 0.6)',  'rgb(80,0,0)',               'rgba(255, 159, 64, 0.6)',
                            'rgb(0,128,128)',           'rgba(95, 192, 95, 0.6)',   'rgba(104, 162, 235, 0.6)',  'rgba(255, 99, 0, 0.6)',
                            'rgba(54, 55, 235, 0.6)',  '	rgb(0, 200, 255)',        'rgba(75, 255, 192, 0.6)',   'rgba(255, 0, 0, 0.6)',
                            'rgba(0, 255, 0, 0.6)',  ' rgb(0, 255, 255)',           'rgba(255, 128, 0, 0.6)',    'rgba(128, 128, 128)',
                            'rgba(32, 64, 128, 0.6)',  ' rgb(128, 0, 128)',         'rgba(128, 64, 64, 0.6)',    'rgba(255, 128, 128, 0.6)',
                            'rgba(192, 255, 0, 0.6)',  ' rgb(0, 0, 128)',           'rgba(201, 201, 32, 0.6)',   'rgba(160, 192, 128, 0.6)',
                          ]
                        }
                      ]
                    }//end chartdata
                  });
                   /*if(result.status === 0 )
                   {
                     temp_this.setState({allJobs:result.data});
                     temp_this.filterJobsPerMonth(result.data);
                   }
                  else{
                    ////console.log("Invalid response");
                  }
                  temp_this.getDriversList();*/
               },
           });

  }
  handleBack()
  {
    this.props.showScreen("dashboard");
  }
  handleChartType(e)
  {
    this.setState({value:e.target.value});

  }


  ShowVersionTable()
  {
    this.setState({value:6});
  }
  //chart type state
  LineChart()
  {
    this.setState({value:0});
  }
  BarChart()
  {
    this.setState({value:1});
  }
  PieChart()
  {
    this.setState({value:2});
  }
  HorizontalChart()
  {
    this.setState({value:3});
  }
  DonutChart()
  {
    this.setState({value:4});
  }
  RadarChart()
  {
    this.setState({value:5});
  }

  handleChangeFilterBy(e)
  {
    //console.log("filter by: ",e.target.value);
    this.setState({filterBy:e.target.value},() => this.displayJobs());
  }


  render(){
    var chart;
    var value = this.state.value;
    var titleText = "Cloudport Version Distribution ("+this.state.totalCount+")";
    if(value == 0)
      {
        chart = <Line
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text: titleText,
              fontSize:25
            },
            legend:{
              display:this.props.displayLegend,
              position:this.props.legendPosition,

            },
          plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
        />;
      }
      else if(value == 1)
        {
          chart = <Bar
            data={this.state.chartData}
            options={{
              title:{
                display:this.props.displayTitle,
                text:titleText,
                fontSize:25,
              },
              legend:{
                display:this.props.displayLegend,
                position:this.props.legendPosition,

              },
          plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
          />;
        }
        else if(value == 2)
          {
            chart = <Pie
              data={this.state.chartData}
              options={{
                title:{
                  display:this.props.displayTitle,
                  text:titleText,
                  fontSize:25,
                },
                legend:{
                  display:this.props.displayLegend,
                  position:this.props.legendPosition,

                },
              plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
            />;
          }
          else if(value == 3)
            {
              chart = <HorizontalBar
                data={this.state.chartData}
                options={{
                  title:{
                    display:this.props.displayTitle,
                    text:titleText,
                    fontSize:25,
                  },
                  legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition,

                  },
                plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
              />;
            }
            else if(value == 4)
              {
                chart = <Doughnut
                  data={this.state.chartData}
                  options={{
                    title:{
                      display:this.props.displayTitle,
                      text:titleText,
                      fontSize:25,
                    },
                    legend:{
                      display:this.props.displayLegend,
                      position:this.props.legendPosition,

                    },
                  plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
                />;
              }
              else if(value == 5)
                {
                  chart = <Radar
                    data={this.state.chartData}
                    options={{
                      title:{
                        display:this.props.displayTitle,
                        text:titleText,
                        fontSize:25,
                      },
                      legend:{
                        display:this.props.displayLegend,
                        position:this.props.legendPosition,
                      },
                    plugins: {
                 datalabels: {
                    display: true,
                    color: 'black'
                 }
              }}}
                  />;
                }
                else if(value == 6)
                {
                  chart = <VersionTable/>;
                }
    return (
      <div>
 
        <div  style={{marginLeft: '10rem',}}>
        <Button onClick={this.handleBack}variant="outlined" color="primary">
          Back
        </Button>
        <Button onClick={this.ShowVersionTable} title="Table"><TableIcon style={{color: 'blue',fontSize:'30px'}}> </TableIcon ></Button>
        <Button onClick={this.LineChart} title="Line chart"><ShowChartIcon style={{color: 'blue',fontSize:'30px'}}> </ShowChartIcon ></Button>
        <Button onClick={this.BarChart} title="Bar chart"><BarChartIcon style={{color: 'blue',fontSize:'30px'}}> </BarChartIcon ></Button>
        <Button onClick={this.PieChart} title="Pie chart"><PieChartIcon style={{color: 'blue',fontSize:'30px'}}></PieChartIcon ></Button>
        <Button onClick={this.HorizontalChart} title="Horizontal chart"><TrendingFlatIcon style={{color: 'blue',fontSize:'30px'}}></TrendingFlatIcon ></Button>
        <Button onClick={this.DonutChart} title="Donut chart"><DonutLargeIcon style={{color: 'blue',fontSize:'30px'}}></DonutLargeIcon ></Button>
        <Button onClick={this.RadarChart} title="Radar chart"><TimelineIcon style={{color: 'blue',fontSize:'30px'}}></TimelineIcon ></Button>
        </div>
        {chart}

      </div>
    )
  }
}
//====
export default Chart;