// src/features/posts/components/PostMediaCarousel.jsx

import { Box } from "@mui/material";

import {
    Navigation,
    Pagination,
} from "swiper/modules";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


export default function PostMediaCarousel({
    media = [],
}) {

    if (!media || media.length === 0) {
        return null;
    }


    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,

                overflow: "hidden",

                position: "relative",

                bgcolor: "black",

                "& .swiper": {
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                },

                "& .swiper-wrapper": {
                    width: "100%",
                },

                "& .swiper-slide": {
                    width: "100% !important",
                    maxWidth: "100%",
                    overflow: "hidden",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                },

            }}
        >

            <Swiper
                modules={[
                    Navigation,
                    Pagination,
                ]}

                navigation={
                    media.length > 1
                }

                pagination={
                    media.length > 1
                        ? {
                            clickable:true
                        }
                        :
                        false
                }

                observer={true}

                observeParents={true}

                resizeObserver={true}

            >

                {
                    media.map((item)=>(
                        <SwiperSlide
                            key={item.id}
                        >

                            {
                                item.media_type === "image"

                                ?

                                <img
                                    src={item.url}
                                    alt=""
                                    loading="lazy"

                                    style={{
                                        width:"100%",
                                        maxWidth:"100%",
                                        height:"auto",

                                        maxHeight:"650px",

                                        objectFit:"contain",

                                        display:"block",
                                    }}

                                />

                                :

                                <video

                                    src={item.url}

                                    controls

                                    style={{
                                        width:"100%",
                                        maxWidth:"100%",
                                        height:"auto",

                                        maxHeight:"650px",

                                        objectFit:"contain",

                                        display:"block",
                                    }}

                                />

                            }

                        </SwiperSlide>
                    ))
                }


            </Swiper>


        </Box>
    );
}