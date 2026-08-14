import {
    Avatar
} from "@mui/material";



export default function ProfileAvatar({

    src,

    username,

    size=120

}) {


    return (

        <Avatar

            src={src}

            alt={username}

            sx={{

                width:size,

                height:size,

                fontSize:size/3,

            }}

        >

            {
                username
                ?.charAt(0)
                ?.toUpperCase()
            }


        </Avatar>

    );

}