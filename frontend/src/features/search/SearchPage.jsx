// src/pages/SearchPage.jsx

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    Typography,
} from "@mui/material";

import useSearch from "../../hooks/useSearch";
import UserSearchResult from "../../components/search/UserSearchResult";
import PostSearchResult from "../../components/search/PostSearchResult";

const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q")?.trim() || "";

    const {
        users,
        posts,
        isLoading,
        isError,
        error,
    } = useSearch(query);

    const hasResults =
        users.length > 0 ||
        posts.length > 0;

    const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong while searching.";

    const resultCount = useMemo(
        () => users.length + posts.length,
        [users.length, posts.length]
    );

    if (query.length < 2) {
        return (
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    px: 2,
                    py: 4,
                }}
            >
                <Typography variant="h5" fontWeight={700}>
                    Search
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Enter at least 2 characters to search.
                </Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 8,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    px: 2,
                    py: 4,
                }}
            >
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                px: {
                    xs: 2,
                    sm: 3,
                },
                py: 4,
            }}
        >
            <Typography
                variant="h5"
                fontWeight={700}
            >
                Search results
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 3 }}
            >
                Results for "{query}" · {resultCount}{" "}
                {resultCount === 1
                    ? "result"
                    : "results"}
            </Typography>

            {!hasResults && (
                <Typography
                    color="text.secondary"
                    sx={{ py: 5, textAlign: "center" }}
                >
                    No results found.
                </Typography>
            )}

            {users.length > 0 && (
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        People
                    </Typography>

                    <List disablePadding>
                        {users.map((user) => (
                            <ListItem
                                key={user.id}
                                disableGutters
                                sx={{
                                    py: 1.5,
                                    cursor: "pointer",
                                }}
                            >
                                <UserSearchResult
                                    user={user}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {users.length > 0 &&
                posts.length > 0 && (
                    <Divider sx={{ my: 3 }} />
                )}

            {posts.length > 0 && (
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        Posts
                    </Typography>

                    <List disablePadding>
                        {posts.map((post) => (
                            <ListItem
                                key={post.id}
                                disableGutters
                                sx={{
                                    py: 1.5,
                                    cursor: "pointer",
                                }}
                            >
                                <PostSearchResult
                                    post={post}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default SearchPage;