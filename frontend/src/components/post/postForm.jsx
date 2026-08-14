import {
    Box,
    Button,
    Paper,
    TextField,
    Typography
} from "@mui/material";


import {
    useForm
} from "react-hook-form";


import {
    useState
} from "react";


import MediaPreview from "./MediaPreview";



export default function PostForm({

    onSubmit,
    onCancel,
    initialData={}

}){


    const {
        register,
        handleSubmit,
        reset
    }=useForm({

        defaultValues:{
            content:
            initialData.content || ""
        }

    });



    const [files,setFiles]=useState([]);



    function handleFiles(e){

        const selected=[
            ...e.target.files
        ];


        setFiles(prev=>[
            ...prev,
            ...selected
        ]);

    }



    function removeFile(index){

        setFiles(prev=>
            prev.filter(
                (_,i)=>i!==index
            )
        );

    }



    function submit(data){


        onSubmit({

            content:data.content,
            files

        });


    }



    return (

        <Paper
            component="form"
            onSubmit={
                handleSubmit(submit)
            }
            sx={{
                p:3,
                maxWidth:700,
                mx:"auto",
            }}
        >


            <Typography
                variant="h5"
                mb={3}
            >
                Create Post
            </Typography>



            <TextField

                {...register(
                    "content",
                    {
                        required:true,
                        maxLength:5000
                    }
                )}

                multiline

                rows={5}

                fullWidth

                placeholder="What are you thinking?"

            />



            <Button
                component="label"
                variant="outlined"
                sx={{
                    mt:2
                }}
            >

                Add Media

                <input

                    hidden

                    multiple

                    type="file"

                    accept="image/*,video/*"

                    onChange={handleFiles}

                />

            </Button>



            {
                files.length>0 &&

                <Box mt={3}>

                    <MediaPreview

                        files={files}

                        onRemove={removeFile}

                    />

                </Box>

            }



            <Box

                sx={{

                    mt:3,

                    display:"flex",

                    justifyContent:"flex-end",

                    gap:2

                }}

            >

                <Button

                    variant="outlined"

                    onClick={onCancel}

                >
                    Cancel

                </Button>


                <Button

                    type="submit"

                    variant="contained"

                >
                    Create

                </Button>


            </Box>



        </Paper>

    )

}