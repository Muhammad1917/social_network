// src/features/comments/components/CommentList.jsx

import {
    Box,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import CommentItem from "./CommentItem";

export default function CommentList({
    comments = [],
    isLoading = false,
    isError = false,
    onReply,
}) {
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems: "center",
                    py: 5,
                }}
            >
                <CircularProgress
                    size={28}
                />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                sx={{
                    px: 2,
                    py: 5,
                    textAlign: "center",
                }}
            >
                <Typography
                    color="error"
                    variant="body2"
                >
                    Failed to load comments.
                </Typography>
            </Box>
        );
    }

    if (!comments.length) {
        return (
            <Box
                sx={{
                    px: 2,
                    py: 6,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="body1"
                    fontWeight={600}
                >
                    No comments yet
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Be the first to comment.
                </Typography>
            </Box>
        );
    }

    return (
        <Stack
            spacing={{
                xs: 2,
                sm: 2.5,
            }}
            sx={{
                width: "100%",
                minWidth: 0,
            }}
        >
            {comments.map(
                (comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={onReply}
                    />
                )
            )}
        </Stack>
    );
}