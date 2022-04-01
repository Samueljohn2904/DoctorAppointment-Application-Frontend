import Header from '../../common/header/Header';
import React, { useEffect, useState, Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import {Tab} from "@material-ui/core";
import Doctor from '../doctorList/DoctorList.js';
import Appointment from '../appointment/Appointment.js';
import './Home.css';

const Home = function(props) {

    //State variables to store user login status and clicked tab status

    const [isUserLoggedIn, setIsUserLoggedIn] = useState('false');
    const [tabCurrentValue, setTabValue] = useState(0);

    //Function to Handle Tab Change

    const handleTabChange = function(event, newValue) {
        setTabValue(newValue);
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
          >
            {value === index && (
                <div>{children}</div>
            )}
          </div>
        );
      }

    //On page re-load whether user is logged in or not is checked here

    useEffect(() => {
        if(sessionStorage.getItem('accessToken')===null)
            setIsUserLoggedIn('false');
        else
            setIsUserLoggedIn('true');
    })

    return(
        <Fragment>
            <Header baseUrl={props.baseUrl} tabPanelFunction={TabPanel} isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}/>
            <div className="Tab-Model">
                <Tabs value={tabCurrentValue} onChange={handleTabChange} aria-label="basic tabs example" centered indicatorColor='primary'>  
                    <Tab label="DOCTORS" style={{maxWidth:"50%", minWidth:"50%"}}/>
                    <Tab label="APPOINTMENT" style={{maxWidth:"50%", minWidth:"50%"}}/>
                </Tabs>
                <TabPanel value={tabCurrentValue} index={0}>
                    <Doctor baseUrl={props.baseUrl}/>
                </TabPanel>
                <TabPanel value={tabCurrentValue} index={1}>
                    <Appointment baseUrl={props.baseUrl} isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn}/>
                </TabPanel>
            </div>
        </Fragment>
    )
}

export default Home;