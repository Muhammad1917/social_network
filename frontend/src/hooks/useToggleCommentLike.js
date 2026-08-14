// src/features/comments/hooks/useToggleCommentLike.js

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import likeApi from "../api/likeApi";

export default function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            commentId,
            isLiked,
        }) =>
            likeApi.toggleCommentLike(
                commentId,
                isLiked
            ),

        onMutate: async ({
            commentId,
            isLiked,
        }) => {
            await queryClient.cancelQueries({
                queryKey: ["comments"],
            });

            const previousQueries =
                queryClient.getQueriesData({
                    queryKey: ["comments"],
                });

            queryClient.setQueriesData(
                {
                    queryKey: ["comments"],
                },
                (oldComments) => {
                    if (!Array.isArray(oldComments)) {
                        return oldComments;
                    }

                    return oldComments.map((comment) => {
                        if (
                            comment.id !==
                            commentId
                        ) {
                            return comment;
                        }

                        const nextIsLiked =
                            !isLiked;

                        const currentCount =
                            comment.likes_count ?? 0;

                        return {
                            ...comment,
                            is_liked: nextIsLiked,
                            likes_count:
                                nextIsLiked
                                    ? currentCount + 1
                                    : Math.max(
                                          0,
                                          currentCount - 1
                                      ),
                        };
                    });
                }
            );

            return {
                previousQueries,
            };
        },

        onError: (
            _error,
            _variables,
            context
        ) => {
            if (!context?.previousQueries) {
                return;
            }

            context.previousQueries.forEach(
                ([queryKey, data]) => {
                    queryClient.setQueryData(
                        queryKey,
                        data
                    );
                }
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments"],
            });
        },
    });
}