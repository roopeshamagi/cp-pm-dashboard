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
const versionsFile = 'versions.json'
const urlsFile = 'urls.json'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

var gCustomerDetails = [];

app.get('/', (req, res) => {
	res.send("Welcome to Amagi Server!!!")
})

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
                var obj = {}
                obj['url'] = url;
                obj['name'] = url.split(".")[0].substr(8);
                obj['upgradable'] = 2;//0 - Yes, 1- No, 2-Not Sure
                obj['remarks']="";
                obj["version"]="";
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
            obj.version = result.message;
        
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
    console.log("-->",gCustomerDetails);
    for(i=0;i<gCustomerDetails.versions.length;i++)
    {
        if(gCustomerDetails.versions[i].name === req.body.name)
        {
            console.log("matching",gCustomerDetails.versions[i]);
            gCustomerDetails.versions[i].upgradable = req.body.upgradable;
            gCustomerDetails.versions[i].remarks = req.body.remarks;
            updateJsonFile = true;
            break;
        }
    }
    if(updateJsonFile)
    {
        jsonfile.writeFile(versionsFile, gCustomerDetails)
        .then(ret=>{
            console.log('Write complete');
        })
        .catch(error => console.log(error))
        res.send("update successful!");
    }
})
app.listen(apiPort, () => console.log(`Amagi Server running on port ${apiPort}`))


