import React from "react";
import {
    Box,
    Paper,
    Stack,
    Toolbar,
    Typography,
    Avatar as MuiAvatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import NavigationItem from "./NavigationItem";
import { getNavigationItems } from "./navigationItems";

import { useAuthStore } from "../../store/authStore";
import SearchBar from "../search/SearchBar";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function DesktopSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useAuthStore.getState().user;
    const { logout } = useAuthStore();

    const navigationItems = getNavigationItems(user);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate("/");
    };

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,

                width: 280,

                display: "flex",
                flexDirection: "column",

                borderRight: "1px solid",
                borderColor: "divider",

                bgcolor: "background.paper",

                zIndex: (theme) => theme.zIndex.drawer,
            }}
        >
            {/* Logo Section */}
            <Toolbar
                sx={{
                    minHeight: "70px !important",
                    px: 3,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    letterSpacing="-0.5px"
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    SocialNet
                </Typography>
            </Toolbar>

            {/* User Profile Section (if logged in) */}
            {user && (
                <Box
                    sx={{
                        px: 3,
                        pb: 3,
                    }}
                >
                    <Box
                        onClick={handleMenuOpen}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            bgcolor: "rgba(102, 126, 234, 0.08)",
                            "&:hover": {
                                bgcolor: "rgba(102, 126, 234, 0.12)",
                            },
                        }}
                    >
                        <MuiAvatar
                            src={user.avatar_url}
                            alt={user.username}
                            sx={{
                                width: 44,
                                height: 44,
                                border: "2px solid",
                                borderColor: "primary.main",
                            }}
                        >
                            {user.username?.charAt(0).toUpperCase()}
                        </MuiAvatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                noWrap
                            >
                                {user.username}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                            >
                                View Profile
                            </Typography>
                        </Box>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 8,
                            sx: {
                                mt: 1.5,
                                borderRadius: 2,
                                overflow: "hidden",
                            },
                        }}
                        transformOrigin={{ horizontal: "left", vertical: "top" }}
                        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                navigate(`/profile/${user.username}`);
                            }}
                            sx={{ gap: 2, py: 1.5 }}
                        >
                            <SettingsRoundedIcon fontSize="small" />
                            <Typography variant="body2">My Profile</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={handleLogout}
                            sx={{ gap: 2, py: 1.5, color: "error.main" }}
                        >
                            <LogoutRoundedIcon fontSize="small" />
                            <Typography variant="body2">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            )}

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