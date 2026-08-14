// src/pages/Register.jsx

import { Box } from "@mui/material";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
    console.log("[Register Page] Render");

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
            <RegisterForm />
        </Box>
    );
}