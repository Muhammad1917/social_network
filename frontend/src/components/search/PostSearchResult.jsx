// src/components/search/PostSearchResult.jsx

import {
    Avatar,
    Box,
    Typography,
} from "@mui/material";

const PostSearchResult = ({ post }) => {
    const author = post.author;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                width: "100%",
                py: 0.5,
            }}
        >
            <Avatar
                src={
                    author?.profile_picture || undefined
                }
                alt={
                    author?.name ||
                    author?.username ||
                    "User"
                }
                sx={{
                    width: 38,
                    height: 38,
                }}
            >
                {author?.username
                    ?.charAt(0)
                    .toUpperCase()}
            </Avatar>

            <Box
                sx={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                >
                    {author?.name ||
                        `@${author?.username}`}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                    }}
                >
                    {post.content}
                </Typography>
            </Box>
        </Box>
    );
};

export default PostSearchResult;