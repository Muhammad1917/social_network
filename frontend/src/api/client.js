
// src/api/client.js

import axios from "axios";
import { useAuthStore } from "../store/authStore";

/**
 * ==========================================================
 * Configuration
 * ==========================================================
 */

const BASE_URL = "http://127.0.0.1:8000";

/**
 * ==========================================================
 * Axios Instance
 * ==========================================================
 */

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

/**
 * ==========================================================
 * Refresh State
 * ==========================================================
 */
const {
    accessToken,
    refreshToken,
    logout,
    setTokens,
} = useAuthStore.getState();

let isRefreshing = false;

let refreshSubscribers = [];

/**
 * Notify waiting requests.
 */
const notifySubscribers = (newAccessToken) => {
    refreshSubscribers.forEach(callback => callback(newAccessToken));

    refreshSubscribers = [];
};

/**
 * Add request to queue.
 */
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

/**
 * ==========================================================
 * Request Interceptor
 * ==========================================================
 */

api.interceptors.request.use(

    (config) => {

        const requiresAuth =
            config.requiresAuth ?? true;

        if (requiresAuth) {

            const accessToken =
                useAuthStore.getState().accessToken;

            if (accessToken) {

                config.headers.Authorization =
                    `JWT ${accessToken}`;
                console.log(`acccess is ${accessToken}`)
            }

        }

        console.groupCollapsed(
            `[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`
        );

        console.log("Params:", config.params);
        console.log("Headers:", config.headers);
        console.log("Body:", config.data);

        console.groupEnd();

        return config;
    },

    (error) => {

        console.error("[REQUEST ERROR]", error);

        return Promise.reject(error);

    }

);

/**
 * ==========================================================
 * Response Interceptor
 * ==========================================================
 */

api.interceptors.response.use(

    (response) => {

        console.groupCollapsed(
            `[API SUCCESS] ${response.config.url}`
        );

        console.log(response.data);

        console.groupEnd();

        return response;

    },

    async (error) => {

        const originalRequest = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }           

        if (originalRequest.requiresAuth === false) {
            return Promise.reject(error);
        }
        if (!accessToken) {

            console.warn(
                "[JWT] No access token. Rejecting request."
            );

            return Promise.reject(error);

        }
        if (!refreshToken) {

            console.warn(
                "[JWT] Missing refresh token."
            );

            logout();

            return Promise.reject(error);

        }
        /**
         * Prevent infinite retry loop.
         */
        if (originalRequest._retry) {

            useAuthStore.getState().logout();

            return Promise.reject(error);

        }

        originalRequest._retry = true;

        /**
         * Another refresh is already running.
         */
        if (isRefreshing) {

            return new Promise((resolve) => {

                subscribeTokenRefresh((token) => {

                    originalRequest.headers.Authorization =
                        `JWT ${token}`;

                    resolve(api(originalRequest));

                });

            });

        }

        isRefreshing = true;

        try {

            console.log("[JWT] Refreshing access token...");

            const refreshToken =
                useAuthStore.getState().refreshToken;
            
            if (!refreshToken) {

                useAuthStore.getState().logout();

                return Promise.reject(error);

            }

            const response = await axios.post(

                `${BASE_URL}/auth/jwt/refresh/`,

                {
                    refresh: refreshToken,
                }

            );

            const newAccess =
                response.data.access;

            useAuthStore.getState().setTokens({

                access: newAccess,

                refresh: refreshToken,

            });

            notifySubscribers(newAccess);

            originalRequest.headers.Authorization =
                `JWT ${newAccess}`;

            return api(originalRequest);

        }

        catch (refreshError) {

            console.error(
                "[JWT] Refresh failed."
            );

            /**
             * Only logout if refresh endpoint
             * actually rejects the refresh token.
             */

            if (refreshError.response?.status === 401) {

                logout();

            }

            return Promise.reject(refreshError);

        }

        finally {

            isRefreshing = false;

        }

    }

);

/**
 * ==========================================================
 * Generic Request
 * ==========================================================
 */

const request = async (

    endpoint,

    {
        method = "GET",

        data,

        params,

        headers = {},

        timeout,

        responseType,

        requiresAuth = true,

    } = {}

) => {

    const response = await api({

        url: endpoint,

        method,

        data,

        params,

        headers,

        timeout,

        responseType,

        requiresAuth,

    });

    return response.data;

};

/**
 * ==========================================================
 * Helpers
 * ==========================================================
 */

const get = (endpoint, options = {}) =>
    request(endpoint, {
        method: "GET",
        ...options,
    });

const post = (endpoint, data, options = {}) =>
    request(endpoint, {
        method: "POST",
        data,
        ...options,
    });

const put = (endpoint, data, options = {}) =>
    request(endpoint, {
        method: "PUT",
        data,
        ...options,
    });

const patch = (endpoint, data, options = {}) =>
    request(endpoint, {
        method: "PATCH",
        data,
        ...options,
    });

const remove = (endpoint, options = {}) =>
    request(endpoint, {
        method: "DELETE",
        ...options,
    });

export default {

    request,

    get,

    post,

    put,

    patch,

    delete: remove,

};