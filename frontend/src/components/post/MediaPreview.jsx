import { motion } from "framer-motion";
import { X } from "lucide-react";


export default function MediaPreview({
    files,
    onRemove
}){


    const previews = files.map(file => ({
        file,
        url: URL.createObjectURL(file)
    }));


    return (

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >

        {
            previews.map((item,index)=>(

                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square overflow-hidden rounded-2xl shadow-lg group"
                >

                {
                    item.file.type.startsWith("image")

                    ?

                    <img
                        src={item.url}
                        alt="preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    :

                    <video
                        src={item.url}
                        controls
                        className="w-full h-full object-cover"
                    />

                }


                <motion.button
                    onClick={()=>onRemove(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                    <X className="w-4 h-4" />
                </motion.button>


                </motion.div>

            ))
        }

        </motion.div>

    )
}
