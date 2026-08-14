// src/features/comments/hooks/useCreateComment.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentApi from "../api/commentApi";

export default function useCreateComment(postId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            commentApi.createComment(
                postId,
                data
            ),

        onSuccess: (newComment) => {
            /*
             * Add the new comment to the current comments
             * cache immediately.
             *
             * For replies, the parent comment's reply count
             * is updated as well.
             */
            queryClient.setQueryData(
                ["comments", postId],
                (oldComments) => {
                    if (!Array.isArray(oldComments)) {
                        return oldComments;
                    }

                    // Top-level comment
                    if (!newComment.parent) {
                        return [
                            ...oldComments,
                            newComment,
                        ];
                    }

                    // Reply
                    return oldComments.map((comment) => {
                        if (
                            comment.id !==
                            newComment.parent
                        ) {
                            return comment;
                        }

                        return {
                            ...comment,
                            replies_count:
                                (comment.replies_count ?? 0) + 1,
                        };
                    });
                }
            );

            /*
             * The PostDisplay comment count is maintained
             * by the posts query. Invalidate it so the server
             * remains the source of truth.
             */
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });
}