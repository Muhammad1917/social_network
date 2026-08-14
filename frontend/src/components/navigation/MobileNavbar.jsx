import { Paper, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import NavigationItem from "./NavigationItem";
import { getNavigationItems } from "./navigationItems";

import { useAuthStore } from "../../store/authStore";


export default function MobileNavbar() {
    const MotionPaper = motion.create(Paper);

    const location = useLocation();

    const user = useAuthStore.getState().user;

    const navigationItems = getNavigationItems(user);

    return (
        <MotionPaper
            initial={{
                y: 80,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            transition={{
                duration: .35,
            }}
            elevation={8}
            sx={(theme) => ({
                position: "fixed",

                left: 16,
                right: 16,
                bottom: 16,

                borderRadius: 100,

                px: 1,
                py: .75,

                zIndex: theme.zIndex.appBar,

                backdropFilter: "blur(18px)",

                background: alpha(
                    theme.palette.background.paper,
                    .88
                ),

                border: `1px solid ${alpha(
                    theme.palette.divider,
                    .25
                )}`,
            })}
        >
            <Stack
                direction="row"
                
                sx={{
                    justifyContent:"space-around",
                    alignItems:"center"
                }}
            >
                {navigationItems.map((item) => {

                    const selected =
                        location.pathname === item.path ||
                        location.pathname.startsWith(item.path + "/");

                    return (
                        <NavigationButton
                            key={item.id}
                            item={item}
                            selected={selected}
                        />
                    );

                })}
            </Stack>
        </MotionPaper>
    );
}

function NavigationButton({
    item,
    selected,
}) {

    return (
        <motion.div
            whileTap={{
                scale: .92,
            }}
            animate={{
                y: selected ? -6 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 24,
            }}
        >
            <NavigationItem
                item={item}
                selected={selected}
                collapsed
                loading={false}
            />
        </motion.div>
    );
}