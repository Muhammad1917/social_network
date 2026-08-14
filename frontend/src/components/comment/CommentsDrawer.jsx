// src/features/comments/components/CommentsDrawer.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import useComments from "../../hooks/useComments";

import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

export default function CommentsDrawer({
    open,
    onClose,
    postId,
    commentsCount = 0,
}) {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );

    const [replyTo, setReplyTo] =
        useState(null);

    const {
        data: comments = [],
        isLoading,
        isError,
    } = useComments(postId, {
        enabled: open,
    });

    /*
     * Clear reply state whenever the drawer closes.
     */
    useEffect(() => {
        if (!open) {
            setReplyTo(null);
        }
    }, [open]);

    const handleReply = (comment) => {
        setReplyTo(comment);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    return (
        <Drawer
            anchor={
                isMobile
                    ? "bottom"
                    : "right"
            }
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    width: {
                        xs: "100%",
                        sm: 430,
                        md: 500,
                    },

                    height: isMobile
                        ? "min(85dvh, 760px)"
                        : "100dvh",

                    maxHeight: "100dvh",

                    borderRadius: isMobile
                        ? "20px 20px 0 0"
                        : 0,

                    overflow: "hidden",

                    display: "flex",
                    flexDirection:
                        "column",
                },
            }}
        >
            {/* Header */}

            <Box
                sx={{
                    flexShrink: 0,
                    px: {
                        xs: 2,
                        sm: 2.5,
                    },
                    py: 1.75,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Comments
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {commentsCount}{" "}
                            {commentsCount ===
                            1
                                ? "comment"
                                : "comments"}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={onClose}
                        aria-label="Close comments"
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Divider />

            {/* Comments */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",

                    /*
                     * Prevent horizontal overflow from
                     * long usernames or comment content.
                     */
                    overflowX: "hidden",

                    px: {
                        xs: 1.5,
                        sm: 2.5,
                    },

                    py: {
                        xs: 2,
                        sm: 2.5,
                    },

                    /*
                     * Better scrolling behavior on mobile.
                     */
                    overscrollBehavior:
                        "contain",

                    scrollbarWidth:
                        "thin",
                }}
            >
                <CommentList
                    comments={comments}
                    isLoading={isLoading}
                    isError={isError}
                    onReply={
                        handleReply
                    }
                />
            </Box>

            <Divider />

            {/* Input */}

            <Box
                sx={{
                    flexShrink: 0,
                    px: {
                        xs: 1.5,
                        sm: 2.5,
                    },
                    py: {
                        xs: 1.25,
                        sm: 1.75,
                    },

                    /*
                     * Important for mobile keyboards /
                     * safe-area devices.
                     */
                    pb: {
                        xs: "calc(10px + env(safe-area-inset-bottom))",
                        sm: 1.75,
                    },

                    bgcolor:
                        "background.paper",
                }}
            >
                <CommentInput
                    postId={postId}
                    replyTo={replyTo}
                    onCancelReply={
                        handleCancelReply
                    }
                />
            </Box>
        </Drawer>
    );
}