import { useEffect, useRef } from "react";

import {
    Box,
    CircularProgress,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import PostDisplay from "../../features/post/postDisplay";

import useInfinitePosts from "../../hooks/useInfinitePosts.jsx";

export default function PostList({
    username,
}) {

    //----------------------------------------
    // Infinite Query
    //----------------------------------------

    const {
        posts,
        isLoading,
        isError,
        error,

        fetchNextPage,
        hasNextPage,

        isFetchingNextPage,
    } = useInfinitePosts({
        ...(username && {
            username,
        }),
    });


    //----------------------------------------
    // Intersection Observer
    //----------------------------------------

    const loadMoreRef = useRef(null);


    useEffect(() => {

        const element = loadMoreRef.current;


        if (!element) {
            return;
        }


        const observer = new IntersectionObserver(
            (entries) => {

                const firstEntry = entries[0];


                if (
                    firstEntry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {

                    console.log(
                        "Loading next posts page..."
                    );

                    fetchNextPage();
                }

            },
            {
                threshold: 1,
            }
        );


        observer.observe(element);


        return () => {

            console.log(
                "Disconnecting post observer"
            );

            observer.disconnect();

        };



    }, [
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    ]);



    //----------------------------------------
    // Debug
    //----------------------------------------

    useEffect(() => {
        console.log(
            "Posts updated:",
            posts
        );

    }, [posts]);



    //----------------------------------------
    // Initial Loading
    //----------------------------------------

    if (isLoading) {

        return (

            <Stack
                spacing={3}
                sx={{
                    maxWidth: 700,
                    mx: "auto",
                    px: {
                        xs: 1,
                        sm: 2,
                    },
                    mt: 3,
                }}
            >

                {[1,2,3].map((item)=>(
                    <PostSkeleton
                        key={item}
                    />
                ))}

            </Stack>

        );

    }



    //----------------------------------------
    // Error
    //----------------------------------------

    if (isError) {

        console.error(
            "Failed loading posts:",
            error
        );


        return (

            <Typography
                color="error"
                align="center"
                mt={5}
            >
                Failed to load posts.
            </Typography>

        );

    }



    //----------------------------------------
    // Empty
    //----------------------------------------

    if (!posts || posts.length === 0) {

        return (

            <Typography
                align="center"
                color="text.secondary"
                mt={5}
            >
                No posts available.
            </Typography>

        );

    }



    //----------------------------------------
    // Render
    //----------------------------------------

    return (
        
        <Stack
            spacing={3}
            sx={{
                maxWidth: 700,
                mx: "auto",

                px:{
                    xs:1,
                    sm:2,
                },

                py:3,
            }}
        >

            {
                posts.map((post)=>(
                    <PostDisplay
                        key={post.id}
                        post={post}
                    />
                ))
            }



            {/* 
                Invisible trigger element.

                When user reaches here,
                next page loads.
            */}

            <Box
                ref={loadMoreRef}
                sx={{
                    height:50,
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                }}
            >

                {
                    isFetchingNextPage && (

                        <CircularProgress
                            size={28}
                        />

                    )
                }


                {
                    !hasNextPage &&
                    posts.length > 0 && (

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No more posts
                        </Typography>

                    )
                }


            </Box>


        </Stack>

    );
}





//----------------------------------------
// Skeleton Component
//----------------------------------------

function PostSkeleton(){

    return (

        <Box>

            <Skeleton
                variant="rounded"
                height={70}
            />


            <Skeleton
                variant="rounded"
                height={400}
                sx={{
                    mt:1,
                }}
            />


            <Skeleton
                width="60%"
                sx={{
                    mt:1,
                }}
            />


        </Box>

    );
}