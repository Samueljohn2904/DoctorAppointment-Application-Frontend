import React , {useState} from 'react';
import '../../common/header/Header.css';
import FormControl from "@material-ui/core/FormControl";
import { InputLabel, Input, Typography} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from '@material-ui/core/Button'; 
import { Fragment } from 'react';

const Login = function(props){

    // State variables to store login Data and Error data

    const [loginData, setLoginData] = useState({
        Email:"",
        loginPassword:""
    })
    const [errData,setErrData] = useState({
        errEmail:'',
        errloginPassword:""
    });

    // Function to handle the login inputs from user
    
    const loginInputhandler = function(e){
        const currErrData = errData;
        const errorField = "err"+e.target.name;
        const currData = loginData;
        currData[e.target.name] = e.target.value;
        setLoginData({...currData});
        currErrData[errorField] = "";
        setErrData({...currErrData});
    }

    //Function to validate the data entered by the user

    const validateLoginData = function(email, password) {
        const regex = new RegExp("^[a-zA-Z0-9]+@[a-z]+[.][a-z]{2,3}$");
        let currErrData = errData;
        if(email==="" || password==="" || !regex.test(email)){
            currErrData.errEmail = (email==="")?"Please fill out this field.": (regex.test(email))?"":"Enter valid email";
            currErrData.errloginPassword = (password==="")?"Please fill out this field.":"";
            setErrData({...currErrData});
        }
        else{
            props.OnLoginSubmitHandler(email, password);
        }
    }
    
    const {Email, loginPassword} = loginData;
    const {errEmail, errloginPassword} = errData;
    
    return (
    <Fragment>
        <Card variant="outlined" style={{alignContent:"center", display:"flex", flexDirection:"column",alignItems:"center"}}>
            <CardContent style={{maxWidth:"270px", minWidth:"270px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="Email">Email</InputLabel>
                    <Input name="Email" type="text" value={Email} onChangeCapture={loginInputhandler}></Input>
                    <FormHelperText className={Email}>
                        <Typography component="span" className="red" style={{color:"red"}}>{errEmail}</Typography>
                    </FormHelperText>
                </FormControl>

            </CardContent>
            <CardContent style={{maxWidth:"270px", minWidth:"270px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input name="loginPassword" type="password" value={loginPassword} onChange={loginInputhandler}></Input>
                    <FormHelperText className={loginPassword}>
                        <Typography component="span" className="red" style={{color:"red"}}>{errloginPassword}</Typography>
                    </FormHelperText>
                </FormControl>
            </CardContent>
            <CardContent>
                <Button style={{display:"flex", flexDirection:"row", justifyContent:"center"}}
                    variant="contained"
                    onClick={e => {e.preventDefault(); validateLoginData(Email, loginPassword)}}
                    color="primary"
                >LOGIN
                </Button>
                </CardContent>
        </Card>
    </Fragment>
    )
}

export default Login;
