// src/features/comments/components/CommentItem.jsx

import {
    memo,
    useState,
} from "react";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

import { formatDistanceToNow } from "date-fns";

import commentApi from "../../api/commentApi";
import likeApi from "../../api/likeApi";

import useToggleCommentLike from "../../hooks/useToggleCommentLike";
import { useQuery } from "@tanstack/react-query";

import CommentItem from "./CommentItem";

function CommentItemComponent({
    comment,
    onReply,
    depth = 0,
}) {
    const [showReplies, setShowReplies] =
        useState(false);

    const toggleLike =
        useToggleCommentLike();

    const hasReplies =
        (comment.replies_count ?? 0) > 0;

    const createdAt =
        comment.created_at ||
        comment.createdAt;

    const timeAgo = createdAt
        ? formatDistanceToNow(
              new Date(createdAt),
              {
                  addSuffix: true,
              }
          )
        : "";

    const handleLike = () => {
        if (toggleLike.isPending) {
            return;
        }

        toggleLike.mutate({
            commentId: comment.id,
            isLiked: comment.is_liked,
        });
    };

    const {
        data: replies = [],
        isLoading: repliesLoading,
    } = useQuery({
        queryKey: [
            "comment-replies",
            comment.id,
        ],

        queryFn: () =>
            commentApi.getReplies(
                comment.id
            ),

        enabled:
            showReplies && hasReplies,

        staleTime: 30 * 1000,

        select: (data) => {
            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.results)) {
                return data.results;
            }

            return [];
        },
    });

    const handleToggleReplies = () => {
        setShowReplies(
            (previous) => !previous
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
            }}
        >
            <Stack
                direction="row"
                spacing={{
                    xs: 1,
                    sm: 1.5,
                }}
                alignItems="flex-start"
            >
                <Avatar
                    src={
                        comment.author
                            ?.avatar
                    }
                    alt={
                        comment.author
                            ?.username
                    }
                    sx={{
                        width: {
                            xs: 34,
                            sm: 40,
                        },
                        height: {
                            xs: 34,
                            sm: 40,
                        },
                        flexShrink: 0,
                    }}
                />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            bgcolor:
                                "action.hover",
                            borderRadius: 3,
                            px: {
                                xs: 1.25,
                                sm: 1.75,
                            },
                            py: {
                                xs: 1,
                                sm: 1.25,
                            },
                            width: "fit-content",
                            maxWidth: "100%",
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {
                                comment
                                    .author
                                    ?.username
                            }
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.35,
                                whiteSpace:
                                    "pre-wrap",
                                overflowWrap:
                                    "anywhere",
                            }}
                        >
                            {
                                comment.content
                            }
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={{
                            xs: 1,
                            sm: 1.5,
                        }}
                        alignItems="center"
                        sx={{
                            mt: 0.5,
                            ml: 0.5,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {timeAgo}
                        </Typography>

                        <Button
                            variant="text"
                            size="small"
                            onClick={() =>
                                onReply?.(
                                    comment
                                )
                            }
                            startIcon={
                                <ReplyRoundedIcon
                                    sx={{
                                        fontSize:
                                            "16px !important",
                                    }}
                                />
                            }
                            sx={{
                                minWidth: 0,
                                p: 0,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Reply
                        </Button>

                        <Stack
                            direction="row"
                            spacing={0.25}
                            alignItems="center"
                        >
                            <IconButton
                                size="small"
                                onClick={
                                    handleLike
                                }
                                disabled={
                                    toggleLike.isPending
                                }
                                sx={{
                                    p: 0.4,
                                }}
                                aria-label={
                                    comment.is_liked
                                        ? "Unlike comment"
                                        : "Like comment"
                                }
                            >
                                {comment.is_liked ? (
                                    <FavoriteIcon
                                        color="error"
                                        sx={{
                                            fontSize: 17,
                                        }}
                                    />
                                ) : (
                                    <FavoriteBorderIcon
                                        sx={{
                                            fontSize: 17,
                                        }}
                                    />
                                )}
                            </IconButton>

                            {(comment.likes_count ??
                                0) > 0 && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {
                                        comment.likes_count
                                    }
                                </Typography>
                            )}
                        </Stack>
                    </Stack>

                    {hasReplies && (
                        <Button
                            variant="text"
                            size="small"
                            onClick={
                                handleToggleReplies
                            }
                            startIcon={
                                showReplies ? (
                                    <ExpandLessRoundedIcon />
                                ) : (
                                    <ExpandMoreRoundedIcon />
                                )
                            }
                            sx={{
                                mt: 0.5,
                                ml: 0.25,
                                p: 0,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            {showReplies
                                ? "Hide replies"
                                : `View ${comment.replies_count} ${
                                      comment.replies_count ===
                                      1
                                          ? "reply"
                                          : "replies"
                                  }`}
                        </Button>
                    )}

                    {showReplies && (
                        <Box
                            sx={{
                                mt: 1,
                                pl: {
                                    xs: 1.5,
                                    sm: 2.5,
                                },
                                borderLeft: 1,
                                borderColor:
                                    "divider",
                            }}
                        >
                            {repliesLoading ? (
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center",
                                        py: 1,
                                    }}
                                >
                                    <CircularProgress
                                        size={20}
                                    />
                                </Box>
                            ) : (
                                <Stack
                                    spacing={1.5}
                                >
                                    {replies.map(
                                        (
                                            reply
                                        ) => (
                                            <CommentItem
                                                key={
                                                    reply.id
                                                }
                                                comment={
                                                    reply
                                                }
                                                onReply={
                                                    onReply
                                                }
                                                depth={
                                                    depth +
                                                    1
                                                }
                                            />
                                        )
                                    )}
                                </Stack>
                            )}
                        </Box>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}

export default memo(
    CommentItemComponent
);