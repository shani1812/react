import React, { useState } from "react";
import { TextField, Button, Modal, Box, Typography, Grid, CircularProgress, SxProps, Grid2 } from "@mui/material";
import { useMutation, useQuery } from 'react-query';
import { getCurrentUser, getUserByEmailAddress } from "../../axios/users"; // Make sure to implement this function
import { createEmail } from "../../axios/emails";
import {Email, NewEmail} from "../../types";

interface NewEmailModalProps {
   open: boolean,
   handleClose: Function
}



const NewEmailModal = ({ open, handleClose }: NewEmailModalProps) => {
  const [to, setTo] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    to: "",
    topic: "",
    message: "",
  });

  // useQuery hook to validate email
  const { data: emailExists, isLoading: isEmailChecking, isError } = useQuery(
    ['check-email', to],
    () => getUserByEmailAddress(to, "from new"),
    {
      enabled: to.length > 0, // Only run the query if 'to' field has a value
      retry: false, // Don't retry on error for simplicity
    }
  );

   const { data: curr } = useQuery("items", ()=>getCurrentUser("new email modal"));
  const {mutate: createEmailMutation} = useMutation(createEmail)

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = { to: "", topic: "", message: "" };
    let formIsValid = true;

    // Validate "To" field
    if (!to) {
      newErrors.to = "Email is required.";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(to)) {
      newErrors.to = "Please enter a valid email address.";
      formIsValid = false;
    } else if (isEmailChecking) {
      newErrors.to = "Checking email...";
      formIsValid = false;
    } else if (isError || !emailExists) {
      newErrors.to = "Email not found.";
      formIsValid = false;
    }

    // Validate "Topic" field
    if (!topic) {
      newErrors.topic = "topic is required.";
      formIsValid = false;
    }

    // Validate "Message" field
    if (!message) {
      newErrors.message = "Message is required.";
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
    } else {
      const email: NewEmail = {addressed: emailExists!.id, addressee: curr!.id, title: topic, text: message }
      createEmailMutation(email)
      handleClose(); 
    }
  };

const ModalContainerStyle: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
const ModalButtonStyle: SxProps = {
      backgroundColor: "white",
      fontWeight: "800",
  };

  return (
    <Modal open={open} onClose={()=>handleClose(false)}>
      <Box
       sx={ModalContainerStyle}
      >
        <Typography variant="h5" >
          New Email
        </Typography>

       
            <TextField
              label="To"
              fullWidth
              value={to}
              margin="normal"
              onChange={(e) => setTo(e.target.value)}
              error={!!errors.to}
              helperText={errors.to}
            />
         
         
            <TextField
              label="Topic"
              fullWidth
              margin="normal"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={!!errors.topic}
              helperText={errors.topic}
            />
        

        
            <TextField
              label="Write your message here"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={!!errors.message}
              helperText={errors.message}
            />
         

          <Grid2 container justifyContent="space-between" alignItems="center">
            <Button
            color="success" variant="outlined" 
              sx={ModalButtonStyle}
              onClick={handleSubmit}
              disabled={isLoading || isEmailChecking}
            >
              {isLoading || isEmailChecking ? <CircularProgress size={24} /> : "Send"}
            </Button>
            <Button color="info" variant="outlined" sx={ModalButtonStyle} onClick={()=>handleClose(false)}>
              Cancel
            </Button>
          </Grid2>
        
      </Box>
    </Modal>
  );
};

export default NewEmailModal;
