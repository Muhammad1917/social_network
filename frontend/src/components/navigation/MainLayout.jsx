import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./Navbar";

export default function MainLayout() {

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <Navbar />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: {
                        md: "250px",
                    },
                    pb: {
                        xs: "90px",
                        md: 0,
                    },
                    width: {
                        md: "calc(100% - 250px)",
                    },
                }}
            >
                <Outlet />
            </Box>

        </Box>

    );

}