// src/api/profileApi.js


import apiClient from "./client";


/**
 * ==========================================================
 * Profile API
 * ==========================================================
 */


const PROFILE_ENDPOINT = "/profiles";


/**
 * ==========================================================
 * Get authenticated user's profile
 *
 * GET /profiles/me/
 *
 * Requires JWT
 * ==========================================================
 */
const getMyProfile = async () => {

    return await apiClient.get(
        `${PROFILE_ENDPOINT}/me/`
    );

};



/**
 * ==========================================================
 * Update authenticated user's profile
 *
 * PATCH /profiles/me/
 *
 * Content-Type:
 * multipart/form-data
 *
 * Used for:
 * - name
 * - bio
 * - profile picture
 * - website
 * - location
 *
 * ==========================================================
 */
const updateMyProfile = async (profileData) => {


    const formData = new FormData();


    Object.entries(profileData)
        .forEach(([key,value]) => {


            /**
             * Do not append empty undefined values
             */
            if(value !== undefined){

                formData.append(
                    key,
                    value
                );

            }

        });



    return await apiClient.patch(
        `${PROFILE_ENDPOINT}/me/`,
        formData,
        {
            headers:{
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );


};




/**
 * ==========================================================
 * Get public profile
 *
 * GET /profiles/<username>/
 *
 * Does not require authentication
 *
 * ==========================================================
 */
const getProfileByUsername = async (
    username
) => {


    return await apiClient.get(

        `${PROFILE_ENDPOINT}/${username}/`,

        {
            requiresAuth:false,
        }

    );

};



export default {

    getMyProfile,

    updateMyProfile,

    getProfileByUsername,

};