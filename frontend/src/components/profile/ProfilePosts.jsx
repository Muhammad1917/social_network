import {
    Box,
    CircularProgress,
    Typography
} from "@mui/material";


import useInfinitePosts from "../../hooks/useInfinitePosts";
import PostDisplay from "../../features/post/postDisplay";



export default function ProfilePosts({
    username
}) {


    const {

        posts,

        isLoading,

        fetchNextPage,

        hasNextPage,

        isFetchingNextPage

    } = useInfinitePosts({

        author: username

    });



    if(isLoading){

        return (

            <Box
                sx={{
                    display:"flex",
                    justifyContent:"center",
                    mt:3
                }}
            >

                <CircularProgress/>

            </Box>

        );

    }



    if(posts.length === 0){

        return (

            <Typography
                sx={{
                    textAlign:"center",
                    mt:3
                }}
            >

                No posts yet

            </Typography>

        );

    }



    return (

        <Box

            sx={{

                display:"flex",

                flexDirection:"column",

                gap:3,

                mt:3

            }}

        >


            {
                posts.map(post=>(

                    <PostDisplay

                        key={post.id}

                        post={post}

                    />

                ))

            }



            {
                hasNextPage &&

                <Box

                    sx={{

                        textAlign:"center",

                        cursor:"pointer",

                        py:2

                    }}

                    onClick={fetchNextPage}

                >

                    {
                        isFetchingNextPage

                        ?

                        <CircularProgress size={24}/>

                        :

                        "Load more"

                    }


                </Box>

            }


        </Box>

    );

}