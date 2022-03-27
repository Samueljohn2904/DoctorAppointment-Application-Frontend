import React , {useState, useEffect, Fragment} from 'react';
import {Box, Paper} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { FormControl, TextField, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import BookAppointment from './BookAppointment';
import DoctorDetails from './DoctorDetails';

const DoctorList = function(props) {

    const specialityUrl = "http://localhost:8080/doctors/speciality";
    const allDoctorUrl = "http://localhost:8080/doctors";

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

    useEffect(() => {
        console.log("In Use Effect")
        loadSpeciality(specialityUrl);
        loadAllDoctors(allDoctorUrl);
        setBookAppointmentHandler('0');
        
    },[])

    const handleSelectorChange = (event) => {
        const {
          target: { value },
        } = event;
          setFilteredSpeciality(value);
          loadFilteredSpeciality(value);
    };

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
                            <ListItemText primary={item} />
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>
            {doctorsList.map(doctor => (
                <Box key={doctor.id} sx={BoxStyle}>
                    <Paper id={doctor.id} elevation={1}>
                    <Typography variant='h6' id={doctor.id} style={{display:"flex",width:"500px", justifyContent:"flex-start", margin:'5px', marginBottom:"15px", padding:"5px"}}>Doctor Name: {`${doctor.firstName} ${doctor.lastName}`}</Typography>
                    <Typography variant='body2' id={doctor.id} style={{display:"flex",width:"240px", justifyContent:"flex-start", marginLeft:"5px", paddingLeft:"5px"}}>Speciality: {doctor.speciality}</Typography>
                    <Typography variant='body2' id={doctor.id} style={{display:"flex",width:"240px", justifyContent:"flex-start", paddingLeft:'5px', marginLeft:'5px'}}>Rating: 
                    <Rating
                        id={doctor.id}
                        value={(doctor.rating===undefined)?0:doctor.rating}
                        precision={0.5}
                        readOnly
                    />
                    </Typography>
                    <div id={doctor.id} style={{display:'grid', gridTemplateColumns:"40% 40%"}}>
                        <Button id={doctor.id} className='header-btn-1' variant="contained" onClick={openBookAppointment => {
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
                        <Button id={doctor.id} className='header-btn-1' variant="contained" onClick={openDoctorDetails => {
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
                            console.log(selectedDoctor);
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