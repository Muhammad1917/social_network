// src/components/search/UserSearchResult.jsx

import {
    Avatar,
    Box,
    Typography,
} from "@mui/material";

const UserSearchResult = ({ user }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                py: 0.5,
            }}
        >
            <Avatar
                src={user.profile_picture || undefined}
                alt={user.name || user.username}
                sx={{
                    width: 42,
                    height: 42,
                }}
            >
                {user.username?.charAt(0).toUpperCase()}
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
                    {user.name || user.username}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                >
                    @{user.username}
                </Typography>
            </Box>
        </Box>
    );
};

export default UserSearchResult;