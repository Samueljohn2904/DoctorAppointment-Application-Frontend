import { Typography } from '@material-ui/core';
import React , {useState, useEffect, Fragment} from 'react';
import { Box } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import RateAppointment from './RateAppointment.js';

const Appointment = function(props) {

    // State variables to store user appointment informations

    const [userId, setUserId] = useState({
        "id":''
    });
    const [rateAppointmentStatus, setRateAppointmentStatus] = useState('0');
    const [appointmentDetails, setAppointmentDetails] = useState({
        "appointmentId":"",
        "doctorId":"",
    })
    const [userAppointmentSize, setUserAppointmentSize] = useState(0);

    const [userAppointments, setUserAppointments] = useState([{}]);

    //Function to close RateAppointment Modal

    const closeRateAppointment = function(){
        setRateAppointmentStatus('0');
    }
 
    //Function to get user appointments from backend

    const getUserAppointments = async function(){
        const currId = userId;
        const userData = JSON.parse(window.sessionStorage.getItem('user-details'));
        currId['id'] = userData.id;
        setUserId({...currId});
        try{
            const rawResponse = await fetch(`/users/${userId.id}/appointments`,{
                "method":'GET',
                headers:{
                    "Access":"application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": `Bearer ${window.sessionStorage.getItem('accessToken')}`
                },
            })

            if(rawResponse.ok){
                const result = await rawResponse.json();
                setUserAppointments(result);
                setUserAppointmentSize(result.length);
            }
            else{
                throw new Error();
            }
        }catch(e){
        console.log(e.message);
        }       
    }

    //Styling attributes
    
    const BoxStyle = {
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        '& > :not(style)': {
        m: 1,
        width: '95%',
        height: 170,
        margin:'15px',
        padding:"20px"
        }
    }
    
    useEffect(() => {
        if(props.isUserLoggedIn==='true')
            getUserAppointments();
    },[])

    return(
        <Fragment>
            {props.isUserLoggedIn==='false' && <Typography variant='body1' className="displayMessage" id="displayMessage" style={{display:"grid", width:"100%", marginTop:'15px', justifyContent:"center", fontWeight:"600"}}>Login to see appointments</Typography>}
            {props.isUserLoggedIn==='true' && userAppointmentSize===0 && <Typography variant='body1' className="displayMessage" id="displayMessage" style={{display:"grid", width:"100%", marginTop:'15px', justifyContent:"center", fontWeight:"600"}}>You dont have any appointments.</Typography>}
            {props.isUserLoggedIn==='true' && userAppointmentSize!==0 && <div className='appointmentDetails' style={{marginTop:"30px"}}>
            {userAppointments.map(appointment => (
                <Box key={appointment.appointmentId} sx={BoxStyle}>
                <Paper id={appointment.appointmentId} elevation={1}>
                    <Typography variant='h6' id={appointment.appointmentId} style={{display:"flex",width:"500px", justifyContent:"flex-start", margin:'5px', marginBottom:"15px", padding:"5px"}}>Doctor Name: {appointment.doctorName}</Typography>
                    <Typography variant='body2' id={appointment.appointmentId} style={{display:"flex",width:"240px", justifyContent:"flex-start", marginLeft:"5px", paddingLeft:"5px"}}>Appointment Date: {appointment.appointmentDate}</Typography>
                    <Typography variant='body2' id={appointment.appointmentId} style={{display:"flex",width:"240px", justifyContent:"flex-start", paddingLeft:'5px', marginLeft:'5px'}}>Symptoms: {appointment.symptoms}</Typography>
                    <Typography variant='body2' id={appointment.appointmentId} style={{display:"flex",width:"240px", justifyContent:"flex-start", paddingLeft:'5px', marginLeft:'5px'}}>Prior Medical History: {appointment.priorMedicalHistory}</Typography>
                    <Button style={{display:"flex", flexDirection:"row", justifyContent:"center", marginLeft:"7px", marginTop:"15px"}}
                        variant="contained"
                        onClick={OnRateAppointmentHandler => {
                            setRateAppointmentStatus('1');
                            const currRating = appointmentDetails;
                            currRating['appointmentId'] = appointment.appointmentId;
                            currRating['doctorId'] = appointment.doctorId;
                            setAppointmentDetails({...currRating});
                        }}
                        color="primary"
                    >RATE APPOINTMENT
                    </Button>
                </Paper>
                </Box>))}
            </div>}
            {rateAppointmentStatus==='1' && <RateAppointment appointmentDetails={appointmentDetails} closeRateAppointment={closeRateAppointment}/>}
        </Fragment>
    )
}

export default Appointment;