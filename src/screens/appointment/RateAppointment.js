import React , {useState, useEffect, Fragment} from 'react';
import Modal from '@material-ui/core/Modal';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { FormControl, TextField, Typography, Input } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Button } from '@material-ui/core';

const RateAppointment = function(props) {

    const [modalOpenStatus, setModalOpenStatus] = useState(true);
    const [ratingError, setRatingError] = useState('');
    const [comment, setComment] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [rating, setRating] = useState({
        "appointmentId":props.appointmentDetails.appointmentId,
        "doctorId":props.appointmentDetails.doctorId,
        "rating":ratingValue,
        "comments":comment
    })

    const handleClose = function(){
        setModalOpenStatus(false);
        props.closeRateAppointment();
    }

    const OnRateAppointmentHandler = async function(e){
        e.preventDefault();
        if(ratingValue===0){
            setRatingError("Submit a rating");
            return;
        }
        try{
            const currRating = rating;
            currRating['comments'] = comment;
            currRating['rating'] = ratingValue;
            setRating({...currRating})
            const rawResponse = await fetch('/ratings',
            {
                method:"POST",
                headers:{
                    "Access":"application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": `Bearer ${window.sessionStorage.getItem('accessToken')}`
                },
                body:JSON.stringify(rating)
            }
            );

            if(rawResponse.ok){
                alert("Rating submitted successfully!!")
                setRating({
                    "appointmentId":'',
                    "doctorId":'',
                    "rating":0,
                    "comments":''
                })
                handleClose();
            }
            else{
                alert("Rating already submitted.");
                handleClose();
                throw new Error("Rating failed!!");
            }
        }catch(e){
            console.log(e.message)
        }
    }

    const handleComments = function(e){
        setComment(e.target.value);
    }

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

    return(
        <Fragment>
            <Modal open={modalOpenStatus} onClose={handleClose} style={ModalStyle}>
                <Card sx={style} variant="outlined">
                <h3 className='modal-header'>Rate an Appointment</h3>
                <CardContent style={{maxWidth:"600px", minWidth:"600px", margin:"2px"}}>
                    <FormControl className="form-control" style={{background:"white"}}> 
                    <TextField id="appointmentComments" label="Comments" type="text" multiline rows={4} value={comment} name="comments" onChange={handleComments} style={{maxWidth:"240px", minWidth:"240px"}}></TextField>
                    </FormControl>
                </CardContent>
                <CardContent style={{maxWidth:"600px", minWidth:"600px", margin:"2px"}}>
                <Typography variant="subtitle1" style={{fontWeight:"bold"}}>Rating:
                    <Rating
                        name="rating"
                        value={ratingValue}
                        onChange={(newValue) => {
                            setRatingError('');
                            setRatingValue(parseInt(newValue.target.value));
                            console.log(ratingValue);
                        }}
                    />
                    </Typography>
                    <Typography component="span" className="red" style={{color:"red"}}>{ratingError}</Typography>
                </CardContent>
                <CardContent>
                    <Button style={{display:"flex", flexDirection:"row", justifyContent:"center"}}
                        variant="contained"
                        onClick={OnRateAppointmentHandler}
                        color="primary"
                        >RATE APPOINTMENT
                    </Button>
                </CardContent>
                </Card>
            </Modal>
        </Fragment>
    )
}

export default RateAppointment;
