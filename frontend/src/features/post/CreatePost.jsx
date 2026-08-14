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


// bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900
    return (
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <PostForm
                    onSubmit={
                        mutation.mutate
                    }
                    onCancel={()=>navigate(-1)}
                />
            </div>
        </div>
    )

}