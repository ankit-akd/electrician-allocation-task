const express = require("express");
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const electricianData = JSON.parse(fs.readFileSync('electricianData.json'));
const rawSiteData = JSON.parse(fs.readFileSync('rawSiteData.json'));

function autoAssignElectricians() {
    const assignedSites = [];
  
    const grievanceSites = rawSiteData.filter((site) => site.grievance);
    const generalSites = rawSiteData.filter((site) => !site.grievance);
  
    const grievanceElectricians = electricianData.filter((electrician) => electrician.grievanceElectrician);
    const generalElectricians = electricianData.filter((electrician) => !electrician.grievanceElectrician);
  
    grievanceSites.forEach((site) => {
      if (grievanceElectricians.length > 0) {
        const electrician = grievanceElectricians.pop();
        assignedSites.push({ site, electrician });
      }
    });
  
    generalSites.forEach((site) => {
      if (generalElectricians.length > 0) {
        const electrician = generalElectricians.pop();
        assignedSites.push({ site, electrician });
      }
    });
  
    const pendingSites = [...grievanceSites, ...generalSites].filter((site) =>
      !assignedSites.some((assignment) => assignment.site === site)
    );
  
    pendingSites.forEach((site) => {
      if (grievanceElectricians.length > 0) {
        const electrician = grievanceElectricians.pop();
        assignedSites.push({ site, electrician });
      }
    });
  
    return assignedSites;
  }

app.get('/elec', (req,res) => {
    res.json(electricianData);
});

app.get('/raw', (req,res) =>{
    res.json(rawSiteData);
});



app.post('/assign', (req, res) => {
    const assignedSites = autoAssignElectricians();
    res.json(assignedSites);
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
