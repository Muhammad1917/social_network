// src/pages/Login.jsx

import { Box } from "@mui/material";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
    console.log("[Login Page] Render");

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
            <LoginForm />
        </Box>
    );
}