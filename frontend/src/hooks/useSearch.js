// src/hooks/useSearch.js

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import searchApi from "../api/searchApi";
import useDebouncedValue from "./useDebouncedValue";

const MIN_SEARCH_LENGTH = 2;

const useSearch = (query) => {
    const debouncedQuery = useDebouncedValue(
        query.trim(),
        300
    );

    const queryResult = useQuery({
        queryKey: ["search", debouncedQuery],

        queryFn: () => searchApi.search(debouncedQuery),

        enabled: debouncedQuery.length >= MIN_SEARCH_LENGTH,

        staleTime: 30 * 1000,

        gcTime: 5 * 60 * 1000,

        placeholderData: keepPreviousData,
    });

    const users = queryResult.data?.users ?? [];
    const posts = queryResult.data?.posts ?? [];

    return {
        ...queryResult,

        users,
        posts,

        results: [
            ...users.map((user) => ({
                ...user,
                type: "user",
            })),

            ...posts.map((post) => ({
                ...post,
                type: "post",
            })),
        ],

        query: debouncedQuery,

        isSearchEnabled:
            debouncedQuery.length >= MIN_SEARCH_LENGTH,
    };
};

export default useSearch;