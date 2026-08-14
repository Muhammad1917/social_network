// src/features/posts/components/PostDisplay.jsx

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentsDrawer from "../../components/comment/CommentsDrawer";
import { formatDistanceToNow } from "date-fns";
import PostDescription from "../../components/post/PostDescription";
import PostMediaCarousel from "../../components/post/PostMediaCarousel";
import likeApi from "../../api/likeApi";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

export default memo(function PostDisplay({ post }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentsOpen, setCommentsOpen] = useState(false);
    if (!post) return null;
    //
    // Like mutation
    //
    const likeMutation = useMutation({
    mutationFn: () =>
        likeApi.togglePostLike(
            post.id,
            post.is_liked
        ),

    onMutate: async () => {
        // Stop outgoing refetches
        await queryClient.cancelQueries({
            queryKey: ["posts"],
        });

        // Save previous cache
        const previousPosts =
            queryClient.getQueryData(["posts"]);

        // Optimistically update cache
        queryClient.setQueryData(
            ["posts"],
            (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        results: page.results.map((p) => {
                            if (p.id !== post.id) {
                                return p;
                            }

                            return {
                                ...p,
                                is_liked: !p.is_liked,
                                likes_count: p.is_liked
                                    ? p.likes_count - 1
                                    : p.likes_count + 1,
                            };
                        }),
                    })),
                };
            }
        );

        return {
            previousPosts,
        };
    },

    onError: (_error, _variables, context) => {
        if (context?.previousPosts) {
            queryClient.setQueryData(
                ["posts"],
                context.previousPosts
            );
        }
    },

    onSettled: () => {
        queryClient.invalidateQueries({
            queryKey: ["posts"],
        });
    },
});
    //----------------------------------------
    // Data
    //----------------------------------------

    const createdAt = post.created_at || post.createdAt;

    const timeAgo = createdAt
        ? formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
          })
        : "";

    //----------------------------------------
    // Event handlers
    //----------------------------------------

    const handleAuthorClick = () => {
        if (!post.author?.username) return;

        navigate(`/profile/${post.author.username}`);
    };

    const handleLikeClick = () => {
        console.log("Like:", post.id);
        
        // TODO
        // Like mutation
        likeMutation.mutate();
    };

    const handleCommentClick = () => {
        console.log("Comments:", post.id);

        // TODO
        // Open comments
        setCommentsOpen(true);
    };

    //----------------------------------------
    // Render
    //----------------------------------------

    return (
        <>
        <Card
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
                minWidth:0,
                maxWidth:700
            }}
        >
            {/* ====================================
                    Header
            ==================================== */}

            <CardContent
                sx={{
                    pb: 2,
                }}
            >
                <Stack
                    direction="row"
                    sx={{alignItems:"center"}}
                    spacing={2}
                >
                    <Avatar
                        src={post.author?.avatar}
                        alt={post.author?.username}
                        onClick={handleAuthorClick}
                        sx={{
                            width: 48,
                            height: 48,
                            cursor: "pointer",
                        }}
                    />

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            fontWeight={600}
                            noWrap
                            onClick={handleAuthorClick}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                                textAlign:'left'
                            }}
                        >
                            {post.author?.username}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{alignItems:"center"}}
                        >
                            <AccessTimeIcon
                                sx={{
                                    fontSize: 14,
                                    color: "text.secondary",
                                }}
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {timeAgo}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>

            {/* ====================================
                    Media
            ==================================== */}

            <PostMediaCarousel media={post.media} />

            {/* ====================================
                    Actions + Description
            ==================================== */}

            <CardContent>
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{alignItems:"center"}}
                >
                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{alignItems:"center"}}
                    >
                        <IconButton
                            onClick={handleLikeClick}
                            size="small"
                        >
                            {post.is_liked ? (
                                <FavoriteIcon
                                    color="error"
                                />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>

                        <Typography
                            variant="body2"
                            fontWeight={500}
                        >
                            {post.likes_count ?? 0}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{alignItems:"center"}}
                    >
                        <IconButton
                            onClick={handleCommentClick}
                            size="small"
                        >
                            <ChatBubbleOutlineIcon />
                        </IconButton>

                        <Typography
                            variant="body2"
                            fontWeight={500}
                        >
                            {post.comments_count ?? 0}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider
                    sx={{
                        my: 2,
                    }}
                />

                <PostDescription
                    content={post.content}
                />
            </CardContent>
        </Card>
        <CommentsDrawer
            open={commentsOpen}
            onClose={() =>
                setCommentsOpen(false)
            }
            postId={post.id}
            commentsCount={
                post.comments_count ?? 0
            }
        />
    </>
    );
});