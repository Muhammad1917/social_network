// src/features/posts/pages/SinglePost.jsx

import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
    Box,
    Card,
    CardContent,
    Skeleton,
    Typography,
} from "@mui/material";

import postApi from "../../api/postApi";
import PostDisplay from "./postDisplay";

export default function SinglePost() {
    //----------------------------------------
    // URL Params
    //----------------------------------------

    const { postId } = useParams();

    //----------------------------------------
    // Debug
    //----------------------------------------

    useEffect(() => {
        console.log("SinglePost mounted.");
        console.log("Post ID:", postId);

        return () => {
            console.log("SinglePost unmounted.");
        };
    }, [postId]);

    //----------------------------------------
    // Query
    //----------------------------------------

    const {
        data: post,
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ["post", postId],

        queryFn: async () => {
            console.log("Fetching post:", postId);

            const response = await postApi.getPost(postId);
            console.log(response);
            console.log("API Response:", response);

            return response;
        },

        enabled: !!postId,

        staleTime: 1000 * 60 * 5,

        retry: 1,

        refetchOnWindowFocus: false,
    });

    //----------------------------------------
    // Error
    //----------------------------------------

    if (error) {
        console.error("Failed to fetch post:", error);

        return (
            <Box
                sx={{
                    maxWidth: 700,
                    mx: "auto",
                    mt: 5,
                }}
            >
                <Typography
                    color="error"
                    align="center"
                >
                    Failed to load this post.
                </Typography>

                {/* TODO:
                    Replace with a proper Error component.
                */}
            </Box>
        );
    }

    //----------------------------------------
    // Loading Skeleton
    //----------------------------------------

    if (isLoading) {
        return (
            <Box
                sx={{
                    maxWidth: 700,
                    mx: "auto",
                    mt: 3,
                }}
            >
                <Card
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    <CardContent>

                        {/* Author */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={45}
                                height={45}
                            />

                            <Box
                                sx={{
                                    ml: 2,
                                    flex: 1,
                                }}
                            >
                                <Skeleton width="35%" />

                                <Skeleton width="20%" />
                            </Box>
                        </Box>

                        {/* Media */}

                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={420}
                        />

                        {/* Buttons */}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={35}
                                height={35}
                            />

                            <Skeleton
                                variant="circular"
                                width={35}
                                height={35}
                            />
                        </Box>

                        {/* Description */}

                        <Skeleton
                            sx={{ mt: 2 }}
                        />

                        <Skeleton />

                        <Skeleton width="60%" />

                    </CardContent>
                </Card>
            </Box>
        );
    }

    //----------------------------------------
    // Empty Response
    //----------------------------------------

    if (!post) {
        console.warn("No post returned from API.");

        return (
            <Box
                sx={{
                    mt: 5,
                }}
            >
                <Typography
                    align="center"
                >
                    Post not found.
                </Typography>
            </Box>
        );
    }

    //----------------------------------------
    // Render
    //----------------------------------------

    return (
        <Box
            sx={{
                py: 3,
                px: {
                    xs: 1,
                    sm: 2,
                },
            }}
        >
            {/* Optional background refetch indicator */}

            {isFetching && !isLoading && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mb: 1,
                        textAlign: "center",
                    }}
                >
                    Refreshing...
                </Typography>
            )}

            <PostDisplay
                post={post}
            />

            {/* -----------------------------------
                TODO:
                <CommentsSection postId={post.id} />

                Responsibilities:
                - Fetch comments
                - Add comment
                - Delete comment
                - Edit comment
                - Pagination / Infinite Scroll
            ------------------------------------ */}

            {/* -----------------------------------
                TODO:
                Related Posts
            ------------------------------------ */}
        </Box>
    );
}