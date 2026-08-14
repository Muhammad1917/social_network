import {

Box,

CircularProgress

} from "@mui/material";


import {
    useState
} from "react";


import {
    useProfile
} from "../../hooks/useProfile";


import ProfileHeader from "../../components/profile/ProfileHeader";

import EditProfileDialog from "../../components/profile/EditProfileDialog";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ProfilePosts from "../../components/profile/ProfilePosts";


export default function ProfilePage() {

    const { username } = useParams();
    const user = useAuthStore.getState().user;
    console.log('username',username)


    const {

        data:profile,

        isLoading

    } = useProfile(username);



    const [

        editOpen,

        setEditOpen

    ] = useState(false);



    if(isLoading)

        return <CircularProgress/>;



    const isOwner =
        user?.username === username;



    return (

        <Box>


            <ProfileHeader

                profile={profile}

                isOwner={isOwner}

                onEdit={
                    ()=>setEditOpen(true)
                }

            />

            <ProfilePosts
            
                    username={username}
            
                />
                

            {
                isOwner &&

                <EditProfileDialog

                    open={editOpen}

                    onClose={
                        ()=>setEditOpen(false)
                    }

                    profile={profile}

                />

            }


        </Box>

    );

}