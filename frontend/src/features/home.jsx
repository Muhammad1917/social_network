// src/pages/Home.jsx

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
    console.log("[Home] Render");

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 6,
                    width: 420,
                }}
            >
                <Stack spacing={4}>

                    <Typography
                        variant="h4"
                        sx={{textAlign:"center"}}
                        fontWeight="bold"
                    >
                        Welcome
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{textAlign:"center"}}
                        color="text.secondary"
                    >
                        Login or create a new account.
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        size="large"
                    >
                        Login
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="outlined"
                        size="large"
                    >
                        Register
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
}