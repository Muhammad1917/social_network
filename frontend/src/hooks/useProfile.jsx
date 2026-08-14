import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import profileApi from "../api/profileApi";


export const useMyProfile = () => {


    return useQuery({

        queryKey:[
            "my-profile"
        ],

        queryFn:
            profileApi.getMyProfile,

    });


};



export const useProfile = (username)=>{


    return useQuery({

        queryKey:[
            "profile",
            username
        ],

        queryFn:()=>(
            profileApi.getProfileByUsername(
                username
            )
        ),

        enabled:!!username,

    });


};



export const useUpdateProfile = ()=>{


    const queryClient =
        useQueryClient();



    return useMutation({

        mutationFn:
            profileApi.updateMyProfile,


        onSuccess:(data)=>{


            queryClient.invalidateQueries({

                queryKey:[
                    "my-profile"
                ]

            });


        },


    });


};