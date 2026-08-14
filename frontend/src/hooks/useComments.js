// src/features/comments/hooks/useComments.js

import { useQuery } from "@tanstack/react-query";
import commentApi from "../api/commentApi";

export default function useComments(postId, options = {}) {
    return useQuery({
        queryKey: ["comments", postId],

        queryFn: () =>
            commentApi.getComments(postId),

        enabled:
            Boolean(postId) &&
            (options.enabled ?? true),

        staleTime: 30 * 1000,

        retry: 2,

        select: (data) => {
            /*
             * The current backend returns an array because
             * pagination is currently disabled.
             *
             * This also supports a future paginated response
             * without requiring changes to CommentList.
             */
            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.results)) {
                return data.results;
            }

            return [];
        },
    });
}