import {

    Box,

    Typography,

    Button,

} from "@mui/material";


import ProfileAvatar from "./ProfileAvatar";



export default function ProfileHeader({

    profile,

    isOwner,

    onEdit

}) {


    return (

        <Box

            sx={{

                display:"flex",

                gap:4,

                alignItems:"center",

                p:3,

            }}

        >


            <ProfileAvatar

                src={
                    profile.profile_picture_url
                }

                username={
                    profile.username
                }

            />



            <Box>


                <Typography variant="h5">

                    {
                        profile.name ||
                        profile.username
                    }

                </Typography>



                <Typography
                    color="text.secondary"
                >

                    @{profile.username}

                </Typography>



                {
                    profile.bio &&

                    <Typography
                        sx={{
                            mt:1
                        }}
                    >

                        {profile.bio}

                    </Typography>

                }



                {
                    isOwner &&

                    <Button

                        sx={{
                            mt:2
                        }}

                        variant="outlined"

                        onClick={onEdit}

                    >

                        Edit Profile

                    </Button>

                }


            </Box>


        </Box>

    );

}