import { Box, Typography } from "@mui/material";

import PostList from "../../components/post/PostList";


export default function ProfilePosts({
    username,
}) {


    //----------------------------------------
    // Debug
    //----------------------------------------

    console.log(
        "Loading posts for user:",
        username
    );



    //----------------------------------------
    // Missing username
    //----------------------------------------

    if (!username) {

        console.warn(
            "ProfilePosts received no username."
        );


        return (

            <Typography
                color="error"
                align="center"
                mt={4}
            >
                User not found.
            </Typography>

        );

    }



    return (

        <Box
            sx={{
                width:"100%",
                minHeight:"100vh",
                py:2,
            }}
        >


            <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                    maxWidth:700,
                    mx:"auto",
                    px:{
                        xs:1,
                        sm:2,
                    },
                    mb:2,
                }}
            >

                Posts by {username}

            </Typography>



            <PostList
                username={username}
            />


        </Box>

    );
}