import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";


import {
    useNavigate
} from "react-router-dom";


import postApi from "../../api/postApi";
import PostForm from "../../components/post/postForm";



export default function CreatePost(){


    const navigate=useNavigate();


    const queryClient=
        useQueryClient();



    const mutation=useMutation({

        mutationFn:(data)=>{


            const formData=
                new FormData();


            formData.append(
                "content",
                data.content
            );


            data.files.forEach(file=>{

                formData.append(
                    "media",
                    file
                );

            });


            return postApi.createPost(
                formData
            );

        },


        onSuccess:()=>{


            queryClient.invalidateQueries({
                queryKey:["posts"]
            });


            navigate("/explore");

        }


    });



    return (

        <PostForm

            onSubmit={
                mutation.mutate
            }


            onCancel={()=>navigate(-1)}
            sx={{maxWidth: 700,
                mx: "auto",}}

        />

    )

}