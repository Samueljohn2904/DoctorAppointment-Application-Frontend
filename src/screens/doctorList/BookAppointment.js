import React , {useState, useEffect, Fragment} from 'react';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import { FormControl, TextField, Typography, Input } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './BookAppointment.css';
import Button from '@material-ui/core/Button';

const BookAppointment = function(props) {

    //State variables to store booking information

    //const currentDate = new Date('2021-05-26T03:24:00');
    const currentDate = new Date();
    const [modalOpenStatus, setModalOpenStatus] = useState(true);
    const [date, setDate] = React.useState(`${currentDate.getFullYear()}-${("0"+(currentDate.getMonth()+1)).slice(-2)}-${("0"+currentDate.getDate()).slice(-2)}`);
    const [timeSlotList, setTimeSlotList] = useState([])
    const [timeSlotError, setTimeSlotError] = useState('');
    const [timeSlotSize, setTimeSlotSize] = useState(0);
    const [appointmentData, setAppointmentData] = useState(
        {
            "doctorId": props.doctor.doctorId,
            "doctorName": props.doctor.doctorName,
            "userId": '',
            "userName": '',
            "userEmailId": '',
            "timeSlot": '',
            "appointmentDate": date,
            "createdDate": '',
            "symptoms": '',
            "priorMedicalHistory": ''
        }
    );

    //Function to close book appointment modal

    const handleClose = function(){
        setModalOpenStatus(false);
        props.bookAppointmentHandler();
    }

    //Function to handle date selection

    const handleSelectorChange = (event) => {
        const {
          target: { value },
        } = event;
          const currAppointmentData = appointmentData;
          currAppointmentData['timeSlot'] = value;
          setAppointmentData({...currAppointmentData});
    };

    //Function to get the logged in user details from session storage

    const getUserDetails = function(){
        const user = JSON.parse(window.sessionStorage.getItem('user-details'));
        const currUserData = appointmentData;
        if(user!=null){
            currUserData['userId'] = user.id;
            currUserData['userName'] = user.firstName+" "+user.lastName;
            currUserData['userEmailId'] = user.id;
            setAppointmentData({...currUserData});
        }
    }
 
    //Function to get the selected doctor's available timeslots

    const getDoctorTimeSlot = async function(appointmentDate){
        try{
            const rawResponse = await fetch(`http://localhost:8080/doctors/${props.doctor.doctorId}/timeSlots?date=${appointmentDate}`,{
                method:'GET'
            })

            if(rawResponse.ok){
                const result = await rawResponse.json();
                setTimeSlotList(result.timeSlot);
                setTimeSlotSize(result.timeSlot.length);
            }
            else{
                throw new Error();
            }
        }catch(e){
            console.log(e.message);
        }       
    }

    //Styling attribute

    const ModalStyle = {
        display:"grid", 
        justifyContent:"center",
        verticalAlign:"middle", 
        alignContent:"center",
    }

    const style = {
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
    };

    //Function to handle date change and also date formatting

    const handleDateChange = function(newDate) {
        const formattedDate = `${newDate.getFullYear()}-${("0"+(newDate.getMonth()+1)).slice(-2)}-${("0"+newDate.getDate()).slice(-2)}`
        const currAppointmentData = appointmentData;
        currAppointmentData['appointmentDate'] = formattedDate;
        setAppointmentData({...currAppointmentData});
        getDoctorTimeSlot(formattedDate);
    }

    //Function to handle book appointment inputs

    const inputChangehandler = function(e){
        const currData = appointmentData;
        currData[e.target.name] = e.target.value;
        setAppointmentData({...currData});
    }

    //Function to book appointment by sending the information to backend server

    const OnBookAppointmentHandler = async function(e){
        e.preventDefault();
        if(appointmentData.timeSlot===''){
            setTimeSlotError("Select a timeslot");
            return;
        }
        try{
            const rawResponse = await fetch('/appointments',
            {
                method:"POST",
                headers:{
                    "Access":"application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": `Bearer ${window.sessionStorage.getItem('accessToken')}`
                },
                body:JSON.stringify(appointmentData)
            }
            );

            if(rawResponse.ok){
                alert("Appointment Booked Successfully!!")
                setAppointmentData({
                    "doctorId": '',
                    "doctorName": '',
                    "userId": '',
                    "userName": '',
                    "userEmailId": '',
                    "timeSlot": '',
                    "appointmentDate": '',
                    "createdDate": '',
                    "symptoms": '',
                    "priorMedicalHistory": ''
                })
                handleClose();
            }
            else{
                alert("Either the slot is already booked or not available.")
                throw new Error("Booking Failed!!");
            }
        }catch(e){
            console.log(e.message)
        }
    }
    
    //On page re-load user details and current date details will be captured
    
    useEffect(() => {
        getDoctorTimeSlot(date);
        getUserDetails();
        const currDate = new Date();
        const currAppointmentData = appointmentData;
        currAppointmentData['createdDate'] = `${currDate.getFullYear()}-${("0"+currDate.getMonth()+1).slice(-2)}-${("0"+currDate.getDate()).slice(-2)}`
        setAppointmentData({...currAppointmentData});
    },[])

    return (
        <Fragment>
            <Modal open={modalOpenStatus} onClose={handleClose} style={ModalStyle}>
            <Card sx={style} variant="outlined">
            <h3 className='modal-header'>Book an Appointment</h3>
            <CardContent style={{maxWidth:"900px", minWidth:"900px", margin:"2px"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                   <TextField disabled id="doctorId" label="DoctorName" type="text" value={appointmentData.doctorName} name="doctorId" style={{maxWidth:"240px", minWidth:"240px"}}></TextField>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
                <FormControl required className="form-control" style={{background:"white"}}> 
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker 
                                disableToolbar
                                format='yyyy/MM/dd'
                                variant='inline'
                                margin='normal'
                                id='date'
                                label='Appointment Date'
                                value={appointmentData.appointmentDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{'aria-label':'change date'}}
                            ></KeyboardDatePicker>
                        </MuiPickersUtilsProvider>
                </FormControl>
            </CardContent>
            {timeSlotSize===0 && <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
            <FormControl variant='standard' style={{display:"flex", margin:"2px"}}>
                <TextField disabled className='timeslot-notAvailable' label="Timeslot" type="text" value="No timeslots available" style={{maxWidth:"240px", minWidth:"240px"}}/>
            </FormControl>
            </CardContent>}
            {timeSlotSize!==0 && <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
            <FormControl required variant='standard' style={{display:"flex", margin:"2px"}}>
                <Typography id="timeslot-selector">Timeslot </Typography>
                    <Select
                        id="timeslot-selector"
                        value={appointmentData.timeSlot}
                        onChange={handleSelectorChange}
                        name="timeSlot"
                        style={{maxWidth:"240px", minWidth:"240px"}}
                        >
                        {timeSlotList.map((item) => (
                            <MenuItem key={`${item}`} value={item}>
                            <ListItemText primary={item} />
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>
            </CardContent>}
            <Typography component="span" className="red" style={{color:"red", maxWidth:"240px", minWidth:"240px", marginLeft:"20px"}}>{timeSlotError}</Typography>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
                <FormControl className="form-control" style={{background:"white", color:"black"}}> 
                    <TextField name="priorMedicalHistory" label="Medical History" multiline rows={4} value={appointmentData.priorMedicalHistory} onChange={inputChangehandler} style={{maxWidth:"240px", minWidth:"240px", color:"black"}}></TextField>
                </FormControl>
            </CardContent>
            <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
                <FormControl className="form-control" style={{background:"white", color:"black"}}> 
                    <TextField name="symptoms" multiline rows={4} value={appointmentData.symptoms} onChange={inputChangehandler} placeholder="ex: Cold, Swelling etc." label="Symptoms" style={{maxWidth:"240px", minWidth:"240px", color:"black"}}></TextField>
                </FormControl>
            </CardContent>
            <CardContent>
            <Button style={{display:"flex", flexDirection:"row", justifyContent:"center"}}
                variant="contained"
                onClick={OnBookAppointmentHandler}
                color="primary"
            >BOOK APPOINTMENT
            </Button>
            </CardContent>
            </Card>
            </Modal>
        </Fragment>
    )
}

export default BookAppointment;