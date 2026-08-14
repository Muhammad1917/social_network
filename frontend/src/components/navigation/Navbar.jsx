// components/navigation/Navbar.jsx

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import DesktopSidebar from "./DesktopSidebar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    return isDesktop
        ? <DesktopSidebar />
        : <MobileNavbar />;
}