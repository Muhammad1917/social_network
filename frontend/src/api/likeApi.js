// src/api/likeApi.js

import client from "./client";

const POSTS_ENDPOINT = "/posts";
const COMMENTS_ENDPOINT = "/comments";

const likeApi = {
    likePost(postId) {
        return client.post(
            `${POSTS_ENDPOINT}/${postId}/like/`
        );
    },

    unlikePost(postId) {
        return client.delete(
            `${POSTS_ENDPOINT}/${postId}/like/`
        );
    },

    togglePostLike(
        postId,
        isLiked
    ) {
        return isLiked
            ? this.unlikePost(postId)
            : this.likePost(postId);
    },

    likeComment(commentId) {
        return client.post(
            `${COMMENTS_ENDPOINT}/${commentId}/like/`
        );
    },

    unlikeComment(commentId) {
        return client.delete(
            `${COMMENTS_ENDPOINT}/${commentId}/like/`
        );
    },

    toggleCommentLike(
        commentId,
        isLiked
    ) {
        return isLiked
            ? this.unlikeComment(commentId)
            : this.likeComment(commentId);
    },
};

export default likeApi;