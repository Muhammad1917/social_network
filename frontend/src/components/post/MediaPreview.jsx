import {
    Box,
    IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import {
    useEffect,
    useState
} from "react";


export default function MediaPreview({
    files,
    onRemove
}){


    const [previews,setPreviews]=useState([]);


    useEffect(()=>{


        const generated = files.map(file=>({

            file,

            url:URL.createObjectURL(file)

        }));


        setPreviews(generated);



        return ()=>{

            generated.forEach(item=>
                URL.revokeObjectURL(item.url)
            );

        }


    },[files]);



    return (

        <Box
            sx={{
                display:"grid",
                gridTemplateColumns:{
                    xs:"1fr",
                    sm:"repeat(2,1fr)",
                    md:"repeat(3,1fr)"
                },
                gap:2
            }}
        >

        {
            previews.map((item,index)=>(

                <Box
                    key={index}
                    sx={{
                        position:"relative",
                        aspectRatio:"1",
                        overflow:"hidden",
                        borderRadius:2
                    }}
                >

                {
                    item.file.type.startsWith("image")

                    ?

                    <Box
                        component="img"
                        src={item.url}
                        sx={{
                            width:"100%",
                            height:"100%",
                            objectFit:"cover"
                        }}
                    />

                    :

                    <Box
                        component="video"
                        src={item.url}
                        controls
                        sx={{
                            width:"100%",
                            height:"100%"
                        }}
                    />

                }


                <IconButton
                    onClick={()=>onRemove(index)}
                    sx={{
                        position:"absolute",
                        right:5,
                        top:5,
                        bgcolor:"white"
                    }}
                >
                    <DeleteIcon/>
                </IconButton>


                </Box>

            ))
        }

        </Box>

    )
}