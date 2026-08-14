import {
    Card,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";

export default function PostSkeleton() {
    return (
        <Card
            sx={{
                maxWidth: 700,
                mx: "auto",
                mt: 3,
                borderRadius: 3,
            }}
        >
            <CardContent>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Skeleton
                        variant="circular"
                        width={45}
                        height={45}
                    />

                    <Stack width="100%">
                        <Skeleton width="35%" />
                        <Skeleton width="20%" />
                    </Stack>

                </Stack>

            </CardContent>

            <Skeleton
                variant="rectangular"
                width="100%"
                height={450}
            />

            <CardContent>

                <Skeleton width={120} />

                <Skeleton />

                <Skeleton />

                <Skeleton width="65%" />

            </CardContent>

        </Card>
    );
}