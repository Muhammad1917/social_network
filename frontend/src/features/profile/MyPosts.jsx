import { useAuthStore } from "@/src/store/authStore";
import ProfilePosts from "../post/ProfilePosts";
import { useParams } from "react-router-dom";


export default function MyPosts() {
    const { username } = useParams();
    const user = useAuthStore.getState().user;
    return <>
    <ProfilePosts

                username={username}

            />
    </>
}