// src/api/postApi.js

import client from "./client";

const POSTS_ENDPOINT = "/posts/";

const postApi = {
    /**
     * -----------------------------------------
     * Feed
     * -----------------------------------------
     */

    getPosts(params = {}) {
        return client.get(POSTS_ENDPOINT, {
            params,
        });
    },

    /**
     * -----------------------------------------
     * Single Post
     * -----------------------------------------
     */

    getPost(postId) {
        return client.get(`${POSTS_ENDPOINT}${postId}/`);
    },

    /**
     * -----------------------------------------
     * Create
     * -----------------------------------------
     */

    createPost(formData) {
        return client.post(
            POSTS_ENDPOINT,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    /**
     * -----------------------------------------
     * Edit
     * -----------------------------------------
     */

    updatePost(postId, formData) {
        return client.patch(
            `${POSTS_ENDPOINT}${postId}/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    /**
     * -----------------------------------------
     * Delete
     * -----------------------------------------
     */

    deletePost(postId) {
        return client.delete(
            `${POSTS_ENDPOINT}${postId}/`
        );
    },
};

export default postApi;