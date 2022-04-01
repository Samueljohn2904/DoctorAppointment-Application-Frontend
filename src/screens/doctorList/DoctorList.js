import React , {useState, useEffect, Fragment} from 'react';
import {Box, Paper} from "@material-ui/core";
import Select from '@material-ui/core/Select';
import { FormControl, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import BookAppointment from './BookAppointment';
import DoctorDetails from './DoctorDetails';

const DoctorList = function(props) {

    //Backend APIs for getting doctor and speciality details

    const specialityUrl = "http://localhost:8080/doctors/speciality";
    const allDoctorUrl = "http://localhost:8080/doctors";

    //State variables for storing the component state data

    const [specialityList, setSpecialityList] = useState([{}]);
    const [doctorsList, setDoctorsList] = useState([{}])
    const [filteredSpeciality, setFilteredSpeciality] = useState('');
    const [bookAppointmentHandler, setBookAppointmentHandler] = useState('0');
    const [doctorDetailsHandler, setDoctorDetailstHandler] = useState('0');
    const [selectedDoctor, setSelectedDoctor] = useState({
        "doctorId":'',
        "doctorName":'',
        "totalYearsOfExp":'',
        "speciality": '',
        "dob": '',
        "city":'',
        "emailId":'',
        "mobile":'',
        "rating":''
    });

    //Function to get the speciality list from backend

    const loadSpeciality = async function(specialityUrl){
        try{
            const rawResponse = await fetch(specialityUrl,{
                method:'GET'
            })

            if(rawResponse.ok){
                const result = await rawResponse.json();
                setSpecialityList(result);
            }
            else{
                throw new Error();
            }
        }catch(e){
        console.log(e.message);
        }       
    }

    //Function to load the doctor details from backend

    const loadAllDoctors = async function(allDoctorUrl){
        try{
            const rawResponse = await fetch(allDoctorUrl,{
                method:'GET'
            })

            if(rawResponse.ok){
                const result = await rawResponse.json();
                setDoctorsList(result);
            }
            else{
                throw new Error();
            }
        }catch(e){
        console.log(e.message);
        }       
    }

    const BoxStyle = {
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        '& > :not(style)': {
        m: 1,
        width: '40%',
        height: 170,
        margin:'5px'
        }
    }

    //Function to filter the doctors based on the speciality selected by the user

    const loadFilteredSpeciality = async function(specialistSelected){
        try{
            const rawResponse = await fetch(`${allDoctorUrl}?speciality=${specialistSelected}`,{
                method:'GET'
            })

            if(rawResponse.ok){
                const result = await rawResponse.json();
                setDoctorsList(result);
            }
            else{
                throw new Error();
            }
        }catch(e){
        console.log(e.message);
        }       
    }

    //On page re-load doctors and speciality details are loaded

    useEffect(() => {
        loadSpeciality(specialityUrl);
        loadAllDoctors(allDoctorUrl);
        setBookAppointmentHandler('0');
        
    },[])

    //Function to handle speciaility selection

    const handleSelectorChange = (event) => {
        const {
          target: { value },
        } = event;
          setFilteredSpeciality(value);
          loadFilteredSpeciality(value);
    };

    //Function to handle closing and opening of Book Appointment Modal

    const closeBookAppointment = function () {
        setBookAppointmentHandler('0');
        setDoctorDetailstHandler('0');
    }

    return (
        <Fragment>
            <FormControl variant='filled' style={{display:"flex", alignItems:"center", margin:"10px"}}>
                <Typography id="speciality-selector" style={{display:"flex",width:"240px", justifyContent:"flex-start", margin:"5px", paddingTop:"5px"}}>   Select Speciality:</Typography>
                    <Select
                        id="speciality-selector"
                        value={filteredSpeciality}
                        onChange={handleSelectorChange}
                        name="doctorSpeciality"
                        style={{maxWidth:"240px", minWidth:"240px"}}
                        >
                        {specialityList.map((item) => (
                            <MenuItem key={`${item}`} value={item}>
                            <ListItemText key={item} primary={item} />
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>
            {doctorsList.map(doctor => (
                <Box key={doctor.id} sx={BoxStyle}>
                    <Paper key={`Paper-${doctor.id}`} id={`Paper-${doctor.id}`} elevation={1}>
                    <Typography key={`doctorName-${doctor.id}`} variant='h6' id={`doctorName-${doctor.id}`} style={{display:"flex",width:"500px", justifyContent:"flex-start", margin:'5px', marginBottom:"15px", padding:"5px"}}>Doctor Name: {`${doctor.firstName} ${doctor.lastName}`}</Typography>
                    <Typography key={`Speciality-${doctor.id}`} variant='body2' id={`Speciality-${doctor.id}`} style={{display:"flex",width:"240px", justifyContent:"flex-start", marginLeft:"5px", paddingLeft:"5px"}}>Speciality: {doctor.speciality}</Typography>
                    <Typography key={`Ratingvalue-${doctor.id}`} variant='body2' id={`Ratingvalue-${doctor.id}`} style={{display:"flex",width:"240px", justifyContent:"flex-start", paddingLeft:'5px', marginLeft:'5px'}}>Rating: 
                    <Rating
                        key={`Rating-${doctor.id}`}
                        id={`Rating-${doctor.id}`}
                        value={(doctor.rating===undefined)?0:doctor.rating}
                        precision={0.5}
                        readOnly
                    />
                    </Typography>
                    <div key={`Button-${doctor.id}`} id={`Button-${doctor.id}`} style={{display:'grid', gridTemplateColumns:"40% 40%"}}>
                        <Button key={`Book-${doctor.id}`} id={`Book-${doctor.id}`} className='header-btn-1' variant="contained" onClick={openBookAppointment => {
                            if(window.sessionStorage.getItem('accessToken')===null)
                                alert("Kindly login to book appointment!!");
                            else{
                                setBookAppointmentHandler('1');
                                const currDoctor = selectedDoctor;
                                currDoctor['doctorId'] = doctor.id;
                                currDoctor['doctorName'] = doctor.firstName+ " "+ doctor.lastName;
                                setSelectedDoctor({...currDoctor});
                            }
                        }} color='primary' style={{margin:"10px", marginLeft:'15px'}}>BOOK APPOINTMENT</Button>
                        <Button key={`ViewDetails-${doctor.id}`} id={`ViewDetails-${doctor.id}`} className='header-btn-1' variant="contained" onClick={openDoctorDetails => {
                            setDoctorDetailstHandler('1');
                            const currDoctor = selectedDoctor;
                            currDoctor['doctorId'] = doctor.id;
                            currDoctor['doctorName'] = doctor.firstName+ " "+ doctor.lastName;
                            currDoctor['dob'] = doctor.dob;
                            currDoctor['emailId'] = doctor.emailId;
                            currDoctor['mobile'] = doctor.mobile;
                            currDoctor['speciality'] = doctor.speciality;
                            currDoctor['totalYearsOfExp'] = doctor.totalYearsOfExp;
                            currDoctor['city'] = doctor.address.city;
                            currDoctor['rating'] = doctor.rating;
                            setSelectedDoctor({...currDoctor});
                        }}style={{margin:"10px", backgroundColor:'green', color:'white'}}>VIEW DETAILS</Button>
                    </div>
                    </Paper>
                </Box>))}
                {bookAppointmentHandler==='1' && <BookAppointment doctor={selectedDoctor} bookAppointmentHandler={closeBookAppointment}/>}
                {doctorDetailsHandler==='1' && <DoctorDetails doctor={selectedDoctor} bookAppointmentHandler={closeBookAppointment}/>}                             
        </Fragment>
    )
}

export default DoctorList;