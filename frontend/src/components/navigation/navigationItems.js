// components/navigation/navigationItems.js

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { SearchSlashIcon } from "lucide-react";

export const getNavigationItems = (user) => [
    // {
    //     id: "feed",
    //     label: "Feed",
    //     icon: HomeRoundedIcon,
    //     path: "/",
    // },
    {
        id: "explore",
        label: "Explore",
        icon: TravelExploreRoundedIcon,
        path: "/explore",
    },
    {
        id: "create",
        label: "Create",
        icon: AddCircleRoundedIcon,
        path: "/create_post",
    },
    {
        id: "profile",
        label: "Profile",
        icon: PersonRoundedIcon,
        path: user
            ? `/profile/${user.username}`
            : "/login",
    },
    
];