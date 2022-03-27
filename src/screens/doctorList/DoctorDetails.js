import React , {useState, useEffect, Fragment} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Rating from '@material-ui/lab/Rating';
import './BookAppointment.css';

const DoctorDetails = function(props) {

    const [modalOpenStatus, setModalOpenStatus] = useState(true);

    const handleClose = function(){
        setModalOpenStatus(false);
        props.bookAppointmentHandler();
    }

    const ModalStyle = {
        display:"grid", 
        justifyContent:"center",
        verticalAlign:"middle", 
        alignContent:"center",
    }

    const style = {
        width: 240,
        bgcolor: 'background.paper',
        border: '2px solid #000',
    };

    return(
        <Fragment>
            <Modal open={modalOpenStatus} onClose={handleClose} style={ModalStyle}>
                <Card sx={style} variant="outlined">
                    <h3 className='modal-header'>Doctor Details</h3>
                    <CardContent style={{maxWidth:"240px", minWidth:"240px", margin:"2px"}}>
                        <Typography variant='h6' id="doctorName" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px', marginBottom:"5px"}}>Dr. {props.doctor.doctorName}</Typography>
                        <Typography variant='body2' id="doctorExperience" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Total Experience: {props.doctor.totalYearsOfExp} Years</Typography>
                        <Typography variant='body2' id="doctorSpeciality" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Speciality: {props.doctor.speciality}</Typography>
                        <Typography variant='body2' id="doctorDOB" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Date of Birth: {props.doctor.dob}</Typography>
                        <Typography variant='body2' id="doctorCity" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>City: {props.doctor.city}</Typography>
                        <Typography variant='body2' id="doctorEmail" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Email: {props.doctor.emailId}</Typography>
                        <Typography variant='body2' id="doctorMobile" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Mobile: {props.doctor.mobile}</Typography>
                        <Typography variant='body2' id="doctorRating" style={{display:"flex",width:"500px", justifyContent:"flex-start", marginLeft:'5px'}}>Rating:
                        <Rating
                            id={props.doctor.doctorId}
                            value={(props.doctor.rating===undefined)?0:props.doctor.rating}
                            precision={0.5}
                            readOnly
                        /></Typography>
                    </CardContent>
                </Card>
            </Modal>
        </Fragment>
    )
}

export default DoctorDetails;