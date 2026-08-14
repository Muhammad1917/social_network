import {

Dialog,

DialogTitle,

DialogContent,

TextField,

Button,

Stack

} from "@mui/material";


import {
    useState
} from "react";



import {
    useUpdateProfile
} from "../../hooks/useProfile";



export default function EditProfileDialog({

    open,

    onClose,

    profile

}) {


    const [form,setForm]=useState({

        name:
            profile.name || "",

        bio:
            profile.bio || "",

        profile_picture:null

    });



    const updateProfile =
        useUpdateProfile();



    const submit=()=>{


        updateProfile.mutate(

            form,

            {

                onSuccess:
                    onClose

            }

        );

    };



    return (

        <Dialog

            open={open}

            onClose={onClose}

        >

            <DialogTitle>

                Edit Profile

            </DialogTitle>



            <DialogContent>


                <Stack
                    spacing={2}
                    sx={{
                        mt:2
                    }}
                >


                    <TextField

                        label="Name"

                        value={form.name}

                        onChange={
                            e=>
                            setForm({

                                ...form,

                                name:e.target.value

                            })
                        }

                    />



                    <TextField

                        label="Bio"

                        multiline

                        rows={4}

                        value={form.bio}

                        onChange={
                            e=>
                            setForm({

                                ...form,

                                bio:e.target.value

                            })
                        }

                    />



                    <Button

                        component="label"

                    >

                        Choose Image

                        <input

                            hidden

                            type="file"

                            accept="image/*"

                            onChange={
                                e=>
                                setForm({

                                    ...form,

                                    profile_picture:
                                    e.target.files[0]

                                })
                            }

                        />


                    </Button>



                    <Button

                        variant="contained"

                        onClick={submit}

                    >

                        Save

                    </Button>


                </Stack>


            </DialogContent>


        </Dialog>

    );

}