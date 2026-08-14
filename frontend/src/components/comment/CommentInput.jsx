// src/features/comments/components/CommentInput.jsx

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { useAuthStore } from "../../store/authStore";
import useCreateComment from "../../hooks/useCreateComment";

export default function CommentInput({
    postId,
    replyTo = null,
    onCancelReply,
    onCreated,
}) {
    const [content, setContent] = useState("");

    const inputRef = useRef(null);

    const createComment = useCreateComment(postId);

    /*
     * Focus the input automatically when replying.
     */
    useEffect(() => {
        if (replyTo) {
            inputRef.current?.focus();
        }
    }, [replyTo]);

    /*
     * Adjust this according to the exact structure
     * of your auth store.
     */
    const user = useAuthStore.getState().user

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedContent =
            content.trim();

        if (
            !trimmedContent ||
            createComment.isPending
        ) {
            return;
        }

        try {
            const newComment =
                await createComment.mutateAsync({
                    content: trimmedContent,
                    parent:
                        replyTo?.id ?? null,
                });

            setContent("");

            onCreated?.(newComment);

            if (replyTo) {
                onCancelReply?.();
            }
        } catch (error) {
            /*
             * React Query exposes the error through
             * createComment.error.
             */
            console.error(
                "Failed to create comment:",
                error
            );
        }
    };

    const handleKeyDown = (event) => {
        /*
         * Ctrl/Cmd + Enter submits.
         *
         * Regular Enter creates a new line.
         */
        if (
            event.key === "Enter" &&
            (event.ctrlKey ||
                event.metaKey)
        ) {
            event.preventDefault();

            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
            }}
        >
            {replyTo && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        mb: 1,
                        px: 1,
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Replying to{" "}
                        <strong>
                            @
                            {
                                replyTo.author
                                    ?.username
                            }
                        </strong>
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={
                            onCancelReply
                        }
                        aria-label="Cancel reply"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                }}
            >
                <Avatar
                    src={user?.avatar}
                    alt={
                        user?.username ||
                        "You"
                    }
                    sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                    }}
                />

                <TextField
                    inputRef={inputRef}
                    value={content}
                    onChange={(event) =>
                        setContent(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                        replyTo
                            ? "Write a reply..."
                            : "Add a comment..."
                    }
                    multiline
                    maxRows={5}
                    fullWidth
                    size="small"
                    disabled={
                        createComment.isPending
                    }
                    slotProps={{
                        htmlInput: {
                            maxLength: 2000,
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={
                        !content.trim() ||
                        createComment.isPending
                    }
                    sx={{
                        minWidth: 42,
                        width: 42,
                        height: 40,
                        borderRadius: 2.5,
                        p: 0,
                        flexShrink: 0,
                    }}
                    aria-label="Post comment"
                >
                    {createComment.isPending ? (
                        <CircularProgress
                            size={20}
                            color="inherit"
                        />
                    ) : (
                        <SendRoundedIcon fontSize="small" />
                    )}
                </Button>
            </Box>

            {createComment.isError && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{
                        display: "block",
                        mt: 0.75,
                        ml: 6,
                    }}
                >
                    Failed to post comment.
                    Please try again.
                </Typography>
            )}
        </Box>
    );
}