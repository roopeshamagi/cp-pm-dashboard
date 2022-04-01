const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 3006
const axios = require('axios');
var _ = require('underscore');
var fs = require('fs');
const { version } = require('os')
const jsonfile = require('jsonfile')
const { findWhere } = require('underscore')
const versionsFile = 'versions.json';
const urlsFile = 'urls.json';
const versionsReleaseDatesFile = "versionsAge.json";

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

var gCustomerDetails = [];

app.get('/', (req, res) => {
	res.send("Welcome to Amagi Server!!!")
})

app.get('/check', (req,res) => {
    console.log("in check");
    try
        {
            //https://oscar.amagi.tv/api/customers? to get all the customers
            //console.log("accessToken: ",accessToken);
            //const endTime = new Date().getTime()
            axios({
                method: "GET",
                url: 'https://oscar.amagi.tv/api/customers?env=production',
            }).then((response)=>{
                console.log("Respomse:", response.data);
                //iterate through the version list and append the missing customers and mark the
                var arr = []
                var versionsInfo = {};
                var versions = [];
                var nonExisting = [];
                jsonfile.readFile(versionsFile, function (err, data) {
                    if (err) 
                    {
                        console.error("Reading Versions: "+err);
                        res.send(err);
                    }
                    else
                    {
                        var count = 0;
                        var o
                        data.versions.forEach(obj =>{
                            str = obj.name+".amagi.tv";
                            f = _.contains(response.data.production.account,str);
                            if(!f)
                            {
                                count++
                                console.log(obj.name+" is not in the production list");
                                nonExisting.push(obj.name);
                            }
                        })
                        console.log(count+"/"+response.data.production.account.length+"customers not in the production list");
                        
                        res.send(nonExisting);
                    }
                })
            })
        }
        catch(error)
        {
            console.log("error:",error);
            res.send(error);
        }
    })
app.get('/getchanneldetails',(reg,res) =>{
    console.log("in get channel details");
    
})

app.get('/getCustomersInProduction', (req,res) =>{
    console.log("in getCustomersInProduction");
    try
        {
            //https://oscar.amagi.tv/api/customers? to get all the customers
            //console.log("accessToken: ",accessToken);
            //const endTime = new Date().getTime()
            axios({
                method: "GET",
                url: 'https://oscar.amagi.tv/api/customers?env=production',
            }).then((response)=>{
                console.log("Respomse:", response.data);
                //iterate through the version list and append the missing customers and mark the
                var arr = []
                var versionsInfo = {};
                var versions = [];
                var newCustomers = [];
                jsonfile.readFile(versionsFile, function (err, data) {
                    if (err) 
                    {
                        console.error("Reading Versions: "+err);
                        res.send(err);
                    }
                    else
                    {
                        var count = 0;
                        response.data.production.account.forEach(customer =>{
                            //arr.push(customer);
                            custName = customer.split(".")[0];
                            f = _.findWhere(data.versions,{name:custName});
                            if(f == undefined)
                            {
                                count++;
                                console.log("new customer",custName);
                                var obj = createVersionObject(custName);
                                newCustomers.push(obj);
                                data.versions.push(obj);
                            }
        
                        })
                        if(count > 0)
                        {
                            jsonfile.writeFile(versionsFile, data)
                            .then(ret=>{
                                console.log('Write complete');
                            })
                            .catch(error => console.log(error))
                        }

                        console.log(count+"/"+response.data.production.account.length+"customers not int he databaase");
                        res.send(newCustomers);
                    }
                })
                
            })
        }
        catch(error)
        {
            console.log("error:",error);
            res.send(error);
        }
})
function createVersionObject(name)
{
    var obj = {};
    obj['url'] = "https://"+name+".amagi.tv/version";
    obj['name'] = name;
    obj['upgradable'] = 0;//0 - Yes, 1- No, 2-Not Sure
    obj['remarks']="";
    obj["version"]="";
    obj["amagi_id"]="";
    obj["product"]="";
    return obj;
}
function init() {
    jsonfile.readFile(urlsFile, function (err, urls) {
        if (err) 
        {
            console.error("Reading urls file: "+err);
            //res.send(err);
        }
        else
        {
            //console.log(data)
            var verList = [];
            var vers = {};
            urls.forEach(url => {
                console.log("url: ", url);
                var obj = createVersionObject(url.split(".")[0].substr(8));
                
                verList.push(obj);
            });
            vers['versions'] = verList;
            var dt = new Date();
            vers['lastupdated'] = Date.parse(dt);
            console.log("verList ===>",vers);
            jsonfile.writeFileSync(versionsFile, vers);
            setTimeout(getVersionList, 10*1000);
        }
    })
}

app.get("/accountslist",(req,res) =>{
    const accounts = [];
    console.log("in get accountslist");
    try
        {
            //console.log("accessToken: ",accessToken);
            //const endTime = new Date().getTime()
            axios({
                method: "GET",
                url: 'https://uajvp6x6xi.execute-api.us-east-1.amazonaws.com/Prod/GetSalesForceAccounts',
            }).then((response)=>{
                console.log("Respomse:", response.data);
                res.send(response.data);
            })
        }
        catch(error)
        {
            console.log("error:",error);
            res.send(error);
        }
})

app.get("/versions",(req,res) =>{
    //const urls = [];
    var versionsInfo = {};
    var versions = [];
    jsonfile.readFile(versionsFile, function (err, data) {
        if (err) 
        {
            console.error("Reading Versions: "+err);
            res.send(err);
        }
        else
        {
             //console.log(data)
             data.versions.forEach(version => {
                versions.push(version);
             });
             versionsInfo['versions'] = versions;
             versionsInfo['lastupdate'] = data.lastupdated;
             res.send(versionsInfo);
        }
       })
})

app.get("/versionlist",(req,res) =>{
    //const urls = [];
    getVersionList();
    res.send("fetching the version details...");
})

const myTimeout = setTimeout(getVersionList, 1000);

function createBackup()
{
    console.log('In createBackup');
	var dt = new Date();
	strFileName = "bkp/"+Date.parse(dt)+".json";
    var versionsInfo = {};
    var versions = [];
    jsonfile.readFile(versionsFile, function (err, data) {
        if (err) 
        {
            console.error("Reading Versions file: "+err);
            //res.send(err);
        }
        else
        {
             console.log("data===>",data);
             data.versions.forEach(version => {
                versions.push(version);
             });
             versionsInfo['versions'] = versions;
             versionsInfo['lastupdated'] = data.lastupdated;
             console.log("versions: ", versions);
             console.log("versionsInfo: ", versionsInfo);
            jsonfile.writeFile(strFileName, versionsInfo)
            .then(res =>{
                console.log("backup file "+strFileName+" created")
            })
            .catch(error => console.error(error))
        }
       })
}

function getVersionList()
{
    console.log("in get versionlist");
    
    var versionList = [];
    jsonfile.readFile(versionsFile, function (err, data) {
        if (err) 
        {
            console.error("Reading Versions file: "+err);
            //res.send(err);
        }
        else
        {
            var dt = new Date();
	        strFileName = "bkp/"+Date.parse(dt)+".json";
            jsonfile.writeFile(strFileName, data)
            .then(res =>{
                console.log("backup file "+strFileName+" created")
                data.versions.forEach(versionObj => {
                    versionList.push(versionObj);
                })
                console.log("versionList ===>",versionList);
                getversions(versionList);
            })
            .catch(error => console.error(error))
        }
       })
    
}

async function getversions(versionList)
{
    var versionsInfo = {};
    var versions = [];
    for(i=0;i<versionList.length;i++)
    {
    //versionList.forEach(versionObj => {
        
        console.log("url: ", versionList[i].url);
        var obj = {};
        obj = versionList[i];
        var result =  await getVersion(obj.url);
        if(result.status == 200)
            obj.version = result.data;
        else
            obj.version = "unknown";
        
        versions.push(obj);
        
    }
    versionsInfo['versions'] = versions;
    var dt = new Date();
    versionsInfo['lastupdated'] = Date.parse(dt);
    gCustomerDetails = versionsInfo;
    jsonfile.writeFile(versionsFile, versionsInfo)
    .then(ret=>{
        console.log('Write complete');
    })
    .catch(error => console.log(error))
    
    setTimeout(getVersionList, 24*60*60*1000);
}
async function getVersion(url) {
    // fetch data from a url endpoint
   
    try{
        const result = await axios.get(url,{timeout:10000});
        return result;
    }
    catch(error)
    {
        return error;
    }
  }

app.put('/updateCustomerDetails',(req,res) =>{
    console.log("In put /updateCustomerDetails: ",req.body);
    obj = req.body;
    var updateJsonFile = false;
    console.log("-->",gCustomerDetails.length);
    for(i=0;i<gCustomerDetails.versions.length;i++)
    {
        if(gCustomerDetails.versions[i].name === req.body.name)
        {
            console.log("matching",gCustomerDetails.versions[i]);
            gCustomerDetails.versions[i].upgradable = req.body.upgradable;
            gCustomerDetails.versions[i].remarks = req.body.remarks;
            gCustomerDetails.versions[i].amagi_id = req.body.amagi_id;
            gCustomerDetails.versions[i].product = req.body.product;

            updateJsonFile = true;
            break;
        }
    }
    if(updateJsonFile)
    {
        console.log("out-->",gCustomerDetails.length);
        jsonfile.writeFile(versionsFile, gCustomerDetails)
        .then(ret=>{
            console.log('Write complete');
        })
        .catch(error => console.log(error))
        res.send("update successful!");
    }
})

app.get("/versionsReleaseDates",(req,res) =>{
    var versions = [];
    jsonfile.readFile(versionsReleaseDatesFile, function (err, data) {
        if (err) 
        {
            console.error("Reading Versions Release Dates file: "+err);
            res.send(err);
        }
        else
        {
             console.log("data===>",data);
             data.forEach(version => {
                versions.push(version);
             });
             res.send(versions);
        }
    })
})

app.listen(apiPort, () => console.log(`Amagi Server running on port ${apiPort}`))


