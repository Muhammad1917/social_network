import { Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";

const COLLAPSED_LENGTH = 180;

export default function PostDescription({ content = "" }) {
    const [expanded, setExpanded] = useState(false);

    const shouldCollapse =
        content.length > COLLAPSED_LENGTH;

    const displayedText = useMemo(() => {
        if (!shouldCollapse || expanded) {
            return content;
        }

        return (
            content.substring(0, COLLAPSED_LENGTH).trim() +
            "..."
        );
    }, [content, expanded, shouldCollapse]);

    if (!content) {
        return null;
    }

    return (
        <>
            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    lineHeight: 1.7,
                }}
            >
                {displayedText}
            </Typography>

            {shouldCollapse && (
                <Button
                    size="small"
                    sx={{
                        mt: 0.5,
                        px: 0,
                        minWidth: 0,
                        textTransform: "none",
                    }}
                    onClick={() =>
                        setExpanded((prev) => !prev)
                    }
                >
                    {expanded ? "Show less" : "More"}
                </Button>
            )}
        </>
    );
}