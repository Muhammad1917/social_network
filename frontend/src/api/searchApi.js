// src/api/searchApi.js

import client from "./client";

const SEARCH_ENDPOINT = "/search/";

const search = async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return {
            users: [],
            posts: [],
        };
    }

    return client.get(SEARCH_ENDPOINT, {
        params: {
            q: trimmedQuery,
        },
    });
};

export default {
    search,
};