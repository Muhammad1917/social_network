import {
    useForm
} from "react-hook-form";


import {
    useState
} from "react";

import { motion } from "framer-motion";
import MediaPreview from "./MediaPreview";
import { Camera, Video } from "lucide-react";



export default function PostForm({

    onSubmit,
    onCancel,
    initialData={}

}){


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch
    }=useForm({

        defaultValues:{
            content:
            initialData.content || ""
        }

    });

    const contentValue = watch("content", "");


    const [files,setFiles]=useState([]);
    const [isDragging, setIsDragging] = useState(false);



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

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const dropped = [...e.dataTransfer.files];
        const validFiles = dropped.filter(file => 
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );
        setFiles(prev => [...prev, ...validFiles]);
    }



    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <form
                onSubmit={
                    handleSubmit(submit)
                }
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >


                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                    >
                        <Camera className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-black-600 to-blue-600 bg-clip-text text-transparent">
                        Create Post
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                        Share your thoughts with the world
                    </p>
                </div>




                <div className="mb-6">
                    <textarea
                        {...register(
                            "content",
                            {
                                required:"Content is required",
                                maxLength:5000
                            }
                        )}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-300 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        rows={5}
                        placeholder="What's on your mind?"
                    />
                    {errors.content && (
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-2 text-red-500 text-sm font-medium"
                        >
                            {errors.content.message}
                        </motion.p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Max 5000 characters
                        </span>
                        <span className={`text-xs font-medium ${
                            contentValue.length > 4500 
                                ? "text-red-500" 
                                : "text-gray-400 dark:text-gray-500"
                        }`}>
                            {contentValue.length}/5000
                        </span>
                    </div>
                </div>




                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                            isDragging
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="flex gap-2 mb-2">
                                <Camera className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                <Video className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-purple-600 dark:text-purple-400">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Images (JPG, PNG) or Videos (MP4)
                            </p>
                        </div>
                        <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFiles}
                        />
                    </label>
                </motion.div>




                {
                    files.length>0 &&

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6"
                    >

                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Attached Media ({files.length})
                            </h3>
                            <button
                                type="button"
                                onClick={() => setFiles([])}
                                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <MediaPreview

                            files={files}

                            onRemove={removeFile}

                        />

                    </motion.div>

                }




                <div
                    className="mt-8 flex flex-col sm:flex-row gap-3"
                >

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                        Cancel
                    </motion.button>


                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                    >
                        Create Post
                    </motion.button>


                </div>



            </form>
        </motion.div>

    )

}
