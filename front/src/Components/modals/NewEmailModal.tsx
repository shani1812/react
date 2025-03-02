import { useEffect, useState } from "react";
import { TextField, Button, Modal, Box, Typography, SxProps, Grid2 } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { getCurrentUser, getUserByEmailAddress } from "../../axios/users"; 
import { createEmail } from "../../axios/emails";
import { NewEmail } from "../../types";
import { toast } from "react-toastify";

interface NewEmailModalProps {
    open: boolean;
    handleClose: Function;
}

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

const NewEmailModal = ({ open, handleClose }: NewEmailModalProps) => {
    const [to, setTo] = useState("");
    const [topic, setTopic] = useState("");
    const [submit, setSubmit] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        to: "",
        topic: "",
        message: "",
    });

    const {
        data: emailExists,
        isLoading: isEmailChecking,
        isError
    } = useQuery(["check-email", to], () => getUserByEmailAddress(to), {
        enabled: submit,
        retry: false,
    });

    const { data: curr } = useQuery("current-user", getCurrentUser);
    const { mutate: createEmailMutation } = useMutation(createEmail);

    const handleSubmit = async () => {
        setSubmit(true);
    };

    useEffect(() => {
        if (submit) {
            const newErrors = { to: "", topic: "", message: "" };
            let formIsValid = true;

            if (!to) {
                newErrors.to = "Email is required.";
                formIsValid = false;
            } else if (!/\S+@\S+\.\S+/.test(to)) {
                newErrors.to = "Please enter a valid email address.";
                formIsValid = false;
            }

            if (isEmailChecking) {
                newErrors.to = "Checking email...";
                formIsValid = false;
            } else if (isError || !emailExists) {
                newErrors.to = "Email not found.";
                formIsValid = false;
            }

            if (!topic) {
                newErrors.topic = "Topic is required.";
                formIsValid = false;
            }

            if (!message) {
                newErrors.message = "Message is required.";
                formIsValid = false;
            }

            if (!formIsValid) {
                setErrors(newErrors);
            } else {
                if (emailExists && curr) {
                    const email: NewEmail = {
                        addressed: emailExists.id,
                        addressee: curr.id,
                        title: topic,
                        text: message,
                    };
                    createEmailMutation(email);
                    handleClose();
                    toast.success("email sent");
                }
            }
        }
    }, [submit, to, topic, message, isEmailChecking, isError, emailExists, curr]);

    const closeModal = () => {
        handleClose(false);
        setTo("");
        setMessage("");
        setTopic("");
    };

    return (
        <Modal open={open} onClose={() => handleClose(false)}>
            <Box sx={ModalContainerStyle}>
                <Typography variant="h5">New Email</Typography>
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
                        color="success"
                        variant="outlined"
                        sx={ModalButtonStyle}
                        onClick={handleSubmit}
                        disabled={isEmailChecking}
                    >
                        Send
                    </Button>
                    <Button color="info" variant="outlined" sx={ModalButtonStyle} onClick={closeModal}>
                        Cancel
                    </Button>
                </Grid2>
            </Box>
        </Modal>
    );
};

export default NewEmailModal;
