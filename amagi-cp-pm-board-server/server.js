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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send("Welcome to Amagi Server!!!")
    
})
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

app.get("/temp",(req,res) =>{

    var list = [{
        "url": "https://abscbn.amagi.tv/version",
        "version": "v7.3.27\n"
    }, {
        "url": "https://accu-weather.amagi.tv/version",
        "version": "v7.5.12\n"
    }, {
        "url": "https://adn.amagi.tv/version",
        "version": "v7.5.18\n"
    }, {
        "url": "https://aenetworks.amagi.tv/version",
        "version": "v7.3.15.1\n"
    }, {
        "url": "https://aenetworksitalia.amagi.tv/version",
        "version": "v7.2.13\n"
    }, {
        "url": "https://africaxp.amagi.tv/version",
        "version": "v6.3.16\n"
    }, {
        "url": "https://alchimie.amagi.tv/version",
        "version": "v7.4.25\n"
    }];
    
    var counter = _.countBy(list,'version');
    console.log(_.size(counter));
    console.log(counter);
    
})

function readversions()
{
    
}

app.get("/versions",(req,res) =>{
    //const urls = [];
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
             data.forEach(version => {
                versions.push(version);
             });
             res.send(versions);
        }
       })
})

var lastInvokedDate = null;
app.get("/versionlist",(req,res) =>{
    //const urls = [];
    getVersionList();
    res.send("fetching the version details...");
})

var versionList = [];
const myTimeout = setTimeout(getVersionList, 10000);

function createBackup()
{
	var dt = new Date();
	strFileName = "bkp/"+Date.parse(dt)+".json";
    
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
             data.forEach(version => {
                versions.push(version);
             });
             console.log("versions: ", versions);
            jsonfile.writeFile(strFileName, versions)
            .then(res =>{
                console.log("backup file "+strFileName+" created")
            })
            .catch(error => console.error(error))
        }
       })
}

async function getVersionList()
{
    console.log("getting version details");
    createBackup();
    /*
    var dt = new Date();
    var bkupFile = Date.parse(dt)+".json";
    jsonfile.writeFile(bkupFile, versionList)
	  .then(ret=>{
	    console.log('Write complete');
      })
	  .catch(error => console.log(error))*/
    versionList = [];
    const urls=["https://abscbn.amagi.tv/version",
"https://accu-weather.amagi.tv/version",
"https://adn.amagi.tv/version",
"https://aenetworks.amagi.tv/version",
"https://aenetworksitalia.amagi.tv/version",
"https://africaxp.amagi.tv/version",
"https://alchimie.amagi.tv/version",
"https://ammo.amagi.tv/version",
"https://appletree.amagi.tv/version",
"https://atmosphere.amagi.tv/version",
"https://b4u-new.amagi.tv/version",
"https://b4u.amagi.tv/version",
"https://barstoolsports.amagi.tv/version",
"https://bein-cp-esp.amagi.tv/version",
"https://bein-emea.amagi.tv/version",
"https://bein-usa.amagi.tv/version",
"https://blueant.amagi.tv/version",
"https://blueantmediauhd-new.amagi.tv/version",
"https://brat.amagi.tv/version",
"https://buzzr.amagi.tv/version",
"https://cinedigm.amagi.tv/version",
"https://circle.amagi.tv/version",
"https://colorssa_new.amagi.tv/version",
"https://condenast.amagi.tv/version",
"https://contech.amagi.tv/version",
"https://crackle.amagi.tv/version",
"https://crownmedia.amagi.tv/version",
"https://curiosity-eu.amagi.tv/version",
"https://curiosity.amagi.tv/version",
"https://cwseed.amagi.tv/version",
"https://dailywire.amagi.tv/version",
"https://discoveryindia.amagi.tv/version",
"https://dogtv.amagi.tv/version",
"https://dsport.amagi.tv/version",
"https://estv.amagi.tv/version",
"https://fandango.amagi.tv/version",
"https://faststudios.amagi.tv/version",
"https://filmdetective.amagi.tv/version",
"https://filmex.amagi.tv/version",
"https://firstmedia.amagi.tv/version",
"https://foodfood.amagi.tv/version",
"https://fubotv.amagi.tv/version",
"https://fuse.amagi.tv/version",
"https://futuretoday.amagi.tv/version",
"https://g4.amagi.tv/version",
"https://groupnine.amagi.tv/version",
"https://gunpowder.amagi.tv/version",
"https://gusto.amagi.tv/version",
"https://heremedia.amagi.tv/version",
"https://hnc.amagi.tv/version",
"https://ign.amagi.tv/version",
"https://img.amagi.tv/version",
"https://inverleigh.amagi.tv/version",
"https://johntesh.amagi.tv/version",
"https://justice.amagi.tv/version",
"https://kidzbop.amagi.tv/version",
"https://kochmedia.amagi.tv/version",
"https://lawandcrime.amagi.tv/version",
"https://lds.amagi.tv/version",
"https://lemeilleurducinema.amagi.tv/version",
"https://lightning.amagi.tv/version",
"https://lionsgate.amagi.tv/version",
"https://litton.amagi.tv/version",
"https://loop.amagi.tv/version",
"https://magnolia.amagi.tv/version",
"https://mavtv.amagi.tv/version",
"https://mezzo.amagi.tv/version",
"https://moonbug.amagi.tv/version",
"https://motorpresse.amagi.tv/version",
"https://nbcu-uk-poc.amagi.tv/version",
"https://nbcu-uk.amagi.tv/version",
"https://nbcu-us.amagi.tv/version",
"https://netx1.amagi.tv/version",
"https://nosey.amagi.tv/version",
"https://olympusat.amagi.tv/version",
"https://osg.amagi.tv/version",
"https://otv.amagi.tv/version",
"https://pac12.amagi.tv/version",
"https://palatinmedia.amagi.tv/version",
"https://pbs-new.amagi.tv/version",
"https://pbs.amagi.tv/version",
"https://peopletv.amagi.tv/version",
"https://playerstv.amagi.tv/version",
"https://pocketwatch.amagi.tv/version",
"https://ptcpunjabi.amagi.tv/version",
"https://quest.amagi.tv/version",
"https://questtv.amagi.tv/version",
"https://qwest.amagi.tv/version",
"https://raycomsports.amagi.tv/version",
"https://rchannel.amagi.tv/version",
"https://redbox.amagi.tv/version",
"https://roku-us.amagi.tv/version",
"https://rooster-teeth.amagi.tv/version",
"https://samsunguhd.amagi.tv/version",
"https://samsunguk.amagi.tv/version",
"https://samsungusa.amagi.tv/version",
"https://samuelgoldwyn.amagi.tv/version",
"https://sbt.amagi.tv/version",
"https://scripps-cp.amagi.tv/version",
"https://sensical.amagi.tv/version",
"https://shalomworld.amagi.tv/version",
"https://shortstv-edge.amagi.tv/version",
"https://shortstv.amagi.tv/version",
"https://shoutfactory.amagi.tv/version",
"https://sling.amagi.tv/version",
"https://snc.amagi.tv/version",
"https://sofy.amagi.tv/version",
"https://sparksport.amagi.tv/version",
"https://sparktv.amagi.tv/version",
"https://spiinternational.amagi.tv/version",
"https://sportsgrid-cp.amagi.tv/version",
"https://studio71.amagi.tv/version",
"https://tarima-new.amagi.tv/version",
"https://tastemade.amagi.tv/version",
"https://tennischannel.amagi.tv/version",
"https://tern-cloud.amagi.tv/version",
"https://tern-cp.amagi.tv/version",
"https://theafricachannel-ota.amagi.tv/version",
"https://theafricachannel.amagi.tv/version",
"https://thedesignnetwork.amagi.tv/version",
"https://thefirst.amagi.tv/version",
"https://thema-vivekanald.amagi.tv/version",
"https://therecount.amagi.tv/version",
"https://thisoldhouse.amagi.tv/version",
"https://toonz-kids.amagi.tv/version",
"https://triplesquirrels.amagi.tv/version",
"https://turner-nordic.amagi.tv/version",
"https://turner.amagi.tv/version",
"https://tvasia.amagi.tv/version",
"https://twist.amagi.tv/version",
"https://tyt.amagi.tv/version",
"https://usatoday-b.amagi.tv/version",
"https://venntv.amagi.tv/version",
"https://viacom18_new.amagi.tv/version",
"https://viacom18.amagi.tv/version",
"https://vice.amagi.tv/version",
"https://vicetv.amagi.tv/version",
"https://vidaprimo.amagi.tv/version",
"https://videosolutions.amagi.tv/version",
"https://vizio.amagi.tv/version",
"https://voxtv.amagi.tv/version",
"https://watchtower.amagi.tv/version",
"https://whistleblower.amagi.tv/version",
"https://whistletv.amagi.tv/version",
"https://xitecp.amagi.tv/version",
"https://xplorationstation.amagi.tv/version",
"https://yahoo.amagi.tv/version",
"https://younghollywood.amagi.tv/version",
"https://youtubetv.amagi.tv/version",
"https://zoomer.amagi.tv/version"]
    console.log("in get versionlist");
    
    for (i=0; i<urls.length;i++)
    {
        console.log("url: ", urls[i]);
        var result = await getVersion(urls[i])
        var obj = {}
        obj['url'] = urls[i];
        if(result.status == 200)
            obj['version'] = result.data;
        else
            obj['version'] = result.message;
        versionList.push(obj);
    }
    jsonfile.writeFile(versionsFile, versionList)
	  .then(ret=>{
	    console.log('Write complete');
      })
	  .catch(error => console.log(error))
    setTimeout(getVersionList, 24*60*60*1000);
    //res.send(versionList);
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

app.listen(apiPort, () => console.log(`Amagi Server running on port ${apiPort}`))


