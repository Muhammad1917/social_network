import {
    Box,
    Paper,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import NavigationItem from "./NavigationItem";
import { getNavigationItems } from "./navigationItems";

import { useAuthStore } from "../../store/authStore";
import SearchBar from "../search/SearchBar";

export default function DesktopSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useAuthStore.getState().user;

    const navigationItems = getNavigationItems(user);

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,

                width: 250,

                display: "flex",
                flexDirection: "column",

                borderRight: "1px solid",
                borderColor: "divider",

                bgcolor: "background.paper",

                zIndex: (theme) => theme.zIndex.drawer,
            }}
        >
            <Toolbar>
                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    YourLogo
                </Typography>
            </Toolbar>

            {/* Search */}
            {/* <Box
                sx={{
                    px: 2,
                    pb: 2,
                }}
            >
                <SearchBar
                    width="100%"
                    onUserSelect={(selectedUser) => {
                        navigate(
                            `/profile/${selectedUser.username}`
                        );
                    }}
                    onPostSelect={(post) => {
                        navigate(`/posts/${post.id}`);
                    }}
                    onSearchSubmit={(query) => {
                        navigate(
                            `/search?q=${encodeURIComponent(query)}`
                        );
                    }}
                />
            </Box> */}

            {/* Navigation */}
            <Box
                sx={{
                    flex: 1,
                    px: 2,
                    py: 2,
                }}
            >
                <Stack spacing={1}>
                    {navigationItems.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            selected={
                                location.pathname === item.path ||
                                location.pathname.startsWith(
                                    item.path + "/"
                                )
                            }
                            loading={false}
                        />
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
}