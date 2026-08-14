// src/api/authApi.js

import client from "./client";
import { useAuthStore } from "../store/authStore";

/**
 * ==========================================================
 * Authentication API
 * ==========================================================
 *
 * Responsible only for:
 *  - Calling authentication endpoints
 *  - Updating auth store
 *
 * NOT responsible for:
 *  - Navigation
 *  - UI
 *  - Snackbar
 *  - Forms
 *
 */

/**
 * ----------------------------------------------------------
 * Register
 * ----------------------------------------------------------
 *
 * POST /auth/register/
 *
 * NOTE:
 * Registration DOES NOT automatically log the user in.
 * The page should redirect to Login after success.
 */

const register = async (payload) => {

    console.group("[Auth API] Register");

    console.log(payload);

    const response = await client.post(

        "/auth/users/",

        payload,

        {
            requiresAuth: false,
        }

    );

    console.log(response);

    console.groupEnd();

    return response;

};

/**
 * ----------------------------------------------------------
 * Login
 * ----------------------------------------------------------
 *
 * POST /auth/login/
 *
 * Expected Response
 *
 * {
 *      access
 *      refresh
 *      user
 * }
 *
 */

const login = async (credentials) => {

    console.group("[Auth API] Login");

    console.log(credentials);

    const response = await client.post(

        "/auth/jwt/create/",

        credentials,

        {
            requiresAuth: false,
        }

    );
     
    
    
    /**
     * Save authentication state.
     */
    
    useAuthStore.getState().login({

        // user: UserDataResponse.user,

        accessToken: response.access,

        refreshToken: response.refresh,

    });
    console.log(useAuthStore.getState().refreshToken)
    console.log(useAuthStore.getState().accessToken)
    const something = await client.get('/api/testauth', {
        requiresAuth:true
    })
    const UserDataResponse = await getCurrentUser()
    console.log(`user is ${UserDataResponse}`)

    console.log("[Auth API] Login Successful");

    console.groupEnd();

    return response;

};

/**
 * ----------------------------------------------------------
 * Logout
 * ----------------------------------------------------------
 */

const logout = async () => {

    console.group("[Auth API] Logout");

    /**
     * TODO
     *
     * If Django later blacklists refresh tokens,
     * call logout endpoint here.
     *
     * Example:
     *
     * await client.post("/auth/logout/", {
     *      refresh: useAuthStore.getState().refreshToken
     * });
     *
     */

    await client.post("/auth/users/logout/", {
        token: useAuthStore.getState().refreshToken
    });
    useAuthStore.getState().logout();

    console.groupEnd();

};

/**
 * ----------------------------------------------------------
 * Refresh User
 * ----------------------------------------------------------
 *
 * Useful when the application starts.
 *
 */

const getCurrentUser = async () => {
    
    console.group("[Auth API] Current User");
    const user = await client.get(

        "/auth/users/me/",
        
        {
            requiresAuth:true,
            // headers : {
            //     token: useAuthStore.getState().accessToken
            // }
        }
        

    );

    useAuthStore.getState().setUser(user);

    console.groupEnd();

    return user;

};

/**
 * ----------------------------------------------------------
 * Update Current User
 * ----------------------------------------------------------
 */

const updateCurrentUser = async (payload) => {

    console.group("[Auth API] Update User");

    const user = await client.patch(

        "/auth/users/me/",

        payload ,
        {
            requiresAuth: false,
        }

    );

    useAuthStore.getState().setUser(user);

    console.groupEnd();

    return user;

};

/**
 * ----------------------------------------------------------
 * Username Availability
 * ----------------------------------------------------------
 *
 * Future:
 * Use with debounce.
 *
 */

const checkUsername = async (username) => {

    console.log("[Auth API] Check Username");

    return client.get(

        "/auth/check-username/",

        {
            params: {

                username,

            },

            requiresAuth: false,

        }

    );

};

/**
 * ----------------------------------------------------------
 * Verify Email
 * ----------------------------------------------------------
 *
 * Future implementation.
 *
 */

const verifyEmail = async (token) => {

    return client.post(

        "/auth/verify-email/",

        {

            token,

        },

        {

            requiresAuth: false,

        }

    );

};

/**
 * ----------------------------------------------------------
 * Forgot Password
 * ----------------------------------------------------------
 */

const forgotPassword = async (email) => {

    return client.post(

        "/auth/forgot-password/",

        {

            email,

        },

        {

            requiresAuth: false,

        }

    );

};

/**
 * ----------------------------------------------------------
 * Reset Password
 * ----------------------------------------------------------
 */

const resetPassword = async (payload) => {

    return client.post(

        "/auth/reset-password/",

        payload,

        {

            requiresAuth: false,

        }

    );

};

/**
 * ----------------------------------------------------------
 * Export
 * ----------------------------------------------------------
 */

const authApi = {

    register,

    login,

    logout,

    getCurrentUser,

    updateCurrentUser,

    checkUsername,

    verifyEmail,

    forgotPassword,

    resetPassword,

};

export default authApi;