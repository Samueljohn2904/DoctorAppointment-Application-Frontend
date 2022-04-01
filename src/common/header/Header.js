import React , {useState, Fragment} from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import Login from '../../screens/login/Login';
import Register from '../../screens/register/Register';
import Modal from '@material-ui/core/Modal';
import image from '../../assets/logo.jpeg';
import Tabs from "@material-ui/core/Tabs";
import {Tab} from "@material-ui/core";

const Header = function(properties) {

    // State variables to store the state values

    const logoutUrl = 'http://localhost:8080/auth/logout';

    const [tabStatus, setTabStatus] = useState({
        login:false,
    });
    const [tabCurrentValue, setTabValue] = useState(0);

    //Handler functions for buttons, Tab and Modal

    const loginHandler = function(){
        setTabStatus({login:true});
    }

    const closeLoginHandler = function(){
        setTabStatus({login:false});
    }

    const handleTabChange = function(event, newValue){
        setTabValue(newValue);
    }

    const {login} = tabStatus;

    const ModalStyle = {
        display:"grid", 
        justifyContent:"center",
        verticalAlign:"middle", 
        alignContent:"center",
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

      //Function to handle logout

      const logoutHandler = async function(){
        const bearerToken = window.sessionStorage.getItem('accessToken');
        try {
            const rawResponse = await fetch(logoutUrl, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    authorization: `Bearer ${bearerToken}`
                }
            });
    
            if(rawResponse.ok) {
                window.sessionStorage.removeItem('user-details');
                window.sessionStorage.removeItem('accessToken');
                properties.setIsUserLoggedIn('false');
                window.location.reload();
            } else {
                const error = new Error(); 
                error.message = 'Logout Failed';
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    //Function to handle login

    const OnLoginSubmitHandler = async function(email, password){
        const param = window.btoa(`${email}:${password}`);
        try {
            const rawResponse = await fetch(`http://localhost:8080/auth/login`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    authorization: `Basic ${param}`
                }
            });
    
            const result = await rawResponse.json();
            if(rawResponse.ok) {
                window.sessionStorage.setItem('user-details', JSON.stringify(result));
                window.sessionStorage.setItem('accessToken', result['accessToken']);
                properties.setIsUserLoggedIn('true');
                closeLoginHandler();

            } else {
                const error = new Error();
                error.message = result.message || 'Login Failed';
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    return (
        <Fragment>
            <div className='header'>
                <img className='header-logo' src={image} alt="logo"/>
                {properties.isUserLoggedIn==='false' && <Button className='header-btn-1' variant="contained" onClick={loginHandler} color="primary" style={{marginTop:"15px"}}>LOGIN</Button>}
                {properties.isUserLoggedIn==='true' && <Button className='header-btn-1' variant="contained" onClick={logoutHandler} color="secondary" style={{marginTop:"15px"}}>LOGOUT</Button>}
                <h2 className='header-name'>Doctor Finder</h2>
            </div>
            {properties.isUserLoggedIn==='false' && <Modal open={login} onClose={closeLoginHandler} style={ModalStyle}>
                <div className="Login-modal" style={{background:"white"}}>
                    <h3 className='modal-header'>Athentication</h3>
                    <Tabs value={tabCurrentValue} onChange={handleTabChange} aria-label="basic tabs example"> 
                        <Tab label="LOGIN"/>
                        <Tab label="REGISTER"/>
                    </Tabs>
                    <TabPanel value={tabCurrentValue} index={0}>
                        <Login baseUrl={properties.baseUrl} OnLoginSubmitHandler={OnLoginSubmitHandler}/>
                    </TabPanel>
                    <TabPanel value={tabCurrentValue} index={1}>
                        <Register baseUrl={properties.baseUrl} OnLoginSubmitHandler={OnLoginSubmitHandler}/>
                    </TabPanel>
                </div>
            </Modal>}
        </Fragment>
    )
}

export default Header;