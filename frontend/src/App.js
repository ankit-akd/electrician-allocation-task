import './App.css';
import { useState, useEffect } from 'react';
function App() {
  const [electricians, setElectricians] = useState([]);
  const [sites, setSites] = useState([]);
  const [assignedSites, setAssignedSites] = useState([]);
  const [newInstallationDate, setNewInstallationDate] = useState(Array(sites.length).fill(''));
  const [newInstallationDates, setNewInstallationDates] = useState({});


  useEffect(() => {
    fetch('http://localhost:3001/elec')
    .then((res) => res.json())
    .then((data) => setElectricians(data));

    fetch('http://localhost:3001/raw')
    .then((res) => res.json())
    .then((data) => setSites(data));
  }, []);

  const handleAutoAssignment = () =>{
    fetch('http://localhost:3001/assign',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
    })
    .then((res) => res.json())
    .then((assignedSites) => {
      setAssignedSites(assignedSites);
    })
    .catch((error) => console.error('Auto-assignment Error:', error));
  };

  const changeInstallationDate = (siteId, newDate) => {
    fetch(`/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDate }),
    })
      .then((res) => res.json())
      .then((updatedSite) => {
        setSites((prevSites) =>
          prevSites.map((site) =>
            site.name === siteId ? { ...site, InstallationDate: updatedSite.InstallationDate } : site
          )
        );
      })
      .catch((error) => console.error('Change Installation Date Error:', error));
  };
  

  return(
    <div className='App'>
      <h1>Electrician Assignment System</h1>
      <div>
        <h2>Electricians</h2>
        <ul>
          {electricians.map((electrician) => (
            <li key={electrician.name}>
              {electrician.name} - {electrician.grievanceElectrician ? 'Grievance' : 'General'}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Sites</h2>
        <table>
          <thead>
            <tr>
              <th>Site Name</th>
              {/* <th>City</th> */}
              <th>Installation Date</th>
              <th>Grievance</th>
              <th>Change Date</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.name}>
                <td>{site.city}</td>
                <td>{site.InstallationDate}</td>
                <td>{site.grievance ? 'Yes' : 'No'}</td>
                <td>
                  <input
                    type="date"
                    value={newInstallationDates[site.name] || site.InstallationDate}
                    onChange={(e) => {
                    const newDate = e.target.value;
                    setNewInstallationDates((prevDates) => ({
                    ...prevDates,
                    [site.name]: newDate,
                    }));
                    }}
                  />
                </td>   
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <button onClick={handleAutoAssignment}>Auto-Assign Electricians</button>

      <div>
        <h2>Assigned Sites</h2>
        <ul>
          {assignedSites.map((site) => (
            <li key={electricians.name}>
              {electricians.name} - Assigned to {site.AssignedElectrician}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
