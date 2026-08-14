import {
    ButtonBase,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

export default function NavigationItem({
    item,
    selected,
    loading,
    collapsed = false,
}) {
    const Icon = item.icon;

    return (
        <ButtonBase
            component={NavLink}
            to={item.path}
            sx={(theme) => ({

                width: collapsed ? 56 : "100%",

                minWidth: collapsed ? 56 : undefined,

                height: 56,

                justifyContent: "center",

                borderRadius: 999,

                transition: "all .25s ease",

                color: selected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,

                backgroundColor: selected
                    ? alpha(theme.palette.primary.main, .14)
                    : "transparent",

                "&:hover": {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        .08
                    ),
                },

            })}
        >
            <Stack
                direction="row"
                spacing={2}
                sx={{alignItems:"center"}}
                width="100%"
            >
                {loading ? (
                    <CircularProgress size={22} />
                ) : (
                    <Icon fontSize="medium" />
                )}

                {!collapsed && (
                    <Typography
                        fontWeight={selected ? 700 : 500}
                    >
                        {item.label}
                    </Typography>
                )}
            </Stack>
        </ButtonBase>
    );
}