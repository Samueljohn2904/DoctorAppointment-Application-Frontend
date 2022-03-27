import React , {useEffect, useState} from 'react';
import '../../common/header/Header.css';
import FormControl from "@material-ui/core/FormControl";
import { InputLabel, Input, Typography, TextField} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from '@material-ui/core/Button'; 

const Register = function(props){

    // state variable to store user details and error message

    const [userData, setUserData] = useState({
        "emailId":'',
        "firstName":'',
        "lastName":'',
        "mobile":'',
        "password":'',
        "dob":''
    });
    const [errData,setErrData] = useState({
        errfirstName:'',
        errlastName:'',
        erremailId:'',
        errpassword:'',
        errmobile:'',
        errdob:''
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [registerDataOk, setRegisterDataOk] = useState(0);

    // Function to handle user inputs

    const inputChangehandler = function(e){
        const currData = userData;
        const currErrData = errData;
        const errorField = "err"+e.target.name;
        currData[e.target.name] = e.target.value;
        setUserData({...currData});
        currErrData[errorField] = "";
        setErrData({...currErrData});
    }

    // Function to validate the user inputs on clicking Register button

    const validateData = function() {
        console.log("In validation");
        let errorData = errData;
        const regex = new RegExp("^[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}$");
        const mobileRegex = new RegExp("^[0-9]{10}$");
        errorData.erremailId=(userData.emailId==="")?"Please fill out this field": (regex.test(userData.emailId))?"":"Enter Valid Email";
        errorData.errlastName=(userData.lastName==="")?"Please fill out this field":"";
        errorData.errfirstName=(userData.firstName==="")?"Please fill out this field":"";
        errorData.errpassword=(userData.password==="")?"Please fill out this field":"";
        errorData.errmobile=(userData.mobile==="")?"Please fill out this field": (mobileRegex.test(userData.mobile))?"":"Enter Valid Mobile Number";
        errorData.errdob=(userData.dob==="")?"Please fill out this field":"";
        setErrData({...errorData});
        if(errData.erremailId==="" && errData.errfirstName==="" && errData.errlastName==="" && errData.errmobile==="" && 
            errData.errpassword==="" && errData.errdob===""){
                return 1;
            }
        else{
            return 0;
        }
    }

    // Function to send details to backend server for new user registration

    const OnRegisterSubmitHandler = async function(e){
        e.preventDefault();
        console.log("In Register Handler");
        if(validateData()){
            try{
                const rawResponse = await fetch('/users/register',
                {
                    method:"POST",
                    headers:{
                        "Access":"application/json",
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body:JSON.stringify(userData)
                }
                );

                if(rawResponse.ok){
                    setSuccessMessage("Registration Successful!!");
                    alert("Registered Successfully!!")
                    console.log("Response tracked");
                    props.OnLoginSubmitHandler(userData.emailId, userData.password);
                }
                else{
                    setSuccessMessage("Registration Failed");
                    throw new Error("Registration Failed");
                }
            }catch(e){
                console.log(e.message)
            }
        }
    }

    const {emailId, firstName, lastName, mobile, password, dob} = userData;
    const {errfirstName, errlastName, erremailId, errpassword, errmobile, errdob} = errData;

    return (
        <Card variant="outlined" style={{alignContent:"center", display:"flex", flexDirection:"column",alignItems:"center"}}>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl className="form-control" required style={{background:"white"}}> 
                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                    <Input id='firstName' name="firstName" type="text" value={firstName} onChange={inputChangehandler}></Input>
                    <Typography component="span" className="red" style={{color:"red"}}>{errfirstName}</Typography>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="lastName">Last Name</InputLabel>
                    <Input name="lastName" type="text" value={lastName} onChange={inputChangehandler}></Input>
                    <Typography component="span" className="red" style={{color:"red"}}>{errlastName}</Typography>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="emailId">Email</InputLabel>
                    <Input name="emailId" type="text" value={emailId} onChange={inputChangehandler}></Input>
                    <Typography component="span" className="red" style={{color:"red"}}>{erremailId}</Typography>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <TextField label="DOB" type="date" onChange={inputChangehandler} value={dob} name="dob" InputLabelProps = {{shrink:true}}></TextField>
                <Typography component="span" className="red" style={{color:"red"}}>{errdob}</Typography>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input name="password" type="password" value={password} onChange={inputChangehandler}></Input>
                    <Typography component="span" className="red" style={{color:"red"}}>{errpassword}</Typography>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <InputLabel htmlFor="mobile">Mobile Number</InputLabel>
                    <Input name="mobile" type="text" value={mobile} onChange={inputChangehandler}></Input>
                    <span className="red" style={{color:"red"}}>{errmobile}</span>
                </FormControl>
                <br></br>
            </CardContent>
            <Typography component="span">{successMessage}</Typography>
            <CardContent>
            <Button style={{display:"flex", flexDirection:"row", justifyContent:"center"}}
                variant="contained"
                onClick={OnRegisterSubmitHandler}
                color="primary"
            >REGISTER
            </Button>
            </CardContent>
        </Card>
    )
}

export default Register;