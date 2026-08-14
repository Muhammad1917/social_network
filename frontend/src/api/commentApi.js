
// src/api/commentApi.js

import client from "./client";

const POSTS_ENDPOINT = "/posts";
const COMMENTS_ENDPOINT = "/comments";

const commentApi = {
    /**
     * ==========================================================
     * Get comments for a post
     * ==========================================================
     *
     * GET /posts/:postId/comments/
     *
     * Returns top-level comments for the post.
     */
    getComments(postId, params = {}) {
        if (!postId) {
            throw new Error("postId is required");
        }

        return client.get(
            `${POSTS_ENDPOINT}/${postId}/comments/`,
            {
                params,
            }
        );
    },

    /**
     * ==========================================================
     * Create a comment or reply
     * ==========================================================
     *
     * POST /posts/:postId/comments/
     *
     * Top-level comment:
     *
     * {
     *     content: "Nice post!"
     * }
     *
     * Reply:
     *
     * {
     *     content: "I agree!",
     *     parent: 42
     * }
     */
    createComment(postId, data) {
        if (!postId) {
            throw new Error("postId is required");
        }

        if (!data?.content?.trim()) {
            throw new Error("Comment content is required");
        }

        return client.post(
            `${POSTS_ENDPOINT}/${postId}/comments/`,
            {
                content: data.content.trim(),
                parent: data.parent ?? null,
            }
        );
    },

    /**
     * ==========================================================
     * Get a single comment
     * ==========================================================
     *
     * GET /comments/:commentId/
     */
    getComment(commentId) {
        if (!commentId) {
            throw new Error("commentId is required");
        }

        return client.get(
            `${COMMENTS_ENDPOINT}/${commentId}/`
        );
    },

    /**
     * ==========================================================
     * Update a comment
     * ==========================================================
     *
     * PATCH /comments/:commentId/
     *
     * Example:
     *
     * {
     *     content: "Updated comment"
     * }
     */
    updateComment(commentId, data) {
        if (!commentId) {
            throw new Error("commentId is required");
        }

        if (!data?.content?.trim()) {
            throw new Error("Comment content is required");
        }

        return client.patch(
            `${COMMENTS_ENDPOINT}/${commentId}/`,
            {
                content: data.content.trim(),
            }
        );
    },

    /**
     * ==========================================================
     * Delete a comment
     * ==========================================================
     *
     * DELETE /comments/:commentId/
     */
    deleteComment(commentId) {
        if (!commentId) {
            throw new Error("commentId is required");
        }

        return client.delete(
            `${COMMENTS_ENDPOINT}/${commentId}/`
        );
    },

    /**
     * ==========================================================
     * Get replies
     * ==========================================================
     *
     * GET /comments/:commentId/replies/
     */
    getReplies(commentId, params = {}) {
        if (!commentId) {
            throw new Error("commentId is required");
        }

        return client.get(
            `${COMMENTS_ENDPOINT}/${commentId}/replies/`,
            {
                params,
            }
        );
    },
};

export default commentApi;

