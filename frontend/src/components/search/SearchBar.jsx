// src/components/search/SearchBar.jsx

import { useState } from "react";
import {
    Autocomplete,
    Box,
    CircularProgress,
    Divider,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import useSearch from "../../hooks/useSearch";
import UserSearchResult from "./UserSearchResult";
import PostSearchResult from "./PostSearchResult";

const SearchBar = ({
    onUserSelect,
    onPostSelect,
    onSearchSubmit,
    width = 320,
}) => {
    const [inputValue, setInputValue] = useState("");

    const {
        results,
        isLoading,
        isFetching,
        isSearchEnabled,
    } = useSearch(inputValue);

    const handleChange = (_, value) => {
        if (!value) {
            return;
        }

        if (value.type === "user") {
            onUserSelect?.(value);
            return;
        }

        if (value.type === "post") {
            onPostSelect?.(value);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key !== "Enter") {
            return;
        }

        const query = inputValue.trim();

        if (!query) {
            return;
        }

        onSearchSubmit?.(query);
    };

    return (
        <Autocomplete
            freeSolo
            options={results}
            value={null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            filterOptions={(options) => options}
            getOptionLabel={(option) => {
                if (typeof option === "string") {
                    return option;
                }

                if (option.type === "user") {
                    return option.username;
                }

                return option.content || "";
            }}
            groupBy={(option) =>
                option.type === "user"
                    ? "People"
                    : "Posts"
            }
            loading={isLoading || isFetching}
            noOptionsText={
                isSearchEnabled
                    ? "No results found"
                    : "Type at least 2 characters"
            }
            sx={{
                width,
            }}
            renderGroup={(params) => (
                <Box key={params.key}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{
                            display: "block",
                            px: 2,
                            pt: 1.5,
                            pb: 0.75,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                        }}
                    >
                        {params.group}
                    </Typography>

                    {params.children}

                    <Divider />
                </Box>
            )}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;

                return (
                    <Box
                        component="li"
                        key={key}
                        {...optionProps}
                        sx={{
                            px: "16px !important",
                            py: "8px !important",
                        }}
                    >
                        {option.type === "user" ? (
                            <UserSearchResult
                                user={option}
                            />
                        ) : (
                            <PostSearchResult
                                post={option}
                            />
                        )}
                    </Box>
                );
            }}
            renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search..."
                        size="small"
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <>
                                    {(isLoading || isFetching) && (
                                        <CircularProgress
                                            color="inherit"
                                            size={18}
                                        />
                                    )}

                                    {params.InputProps?.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
        />
    );
};

export default SearchBar;