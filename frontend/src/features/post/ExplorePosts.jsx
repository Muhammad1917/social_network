import { useNavigate } from "react-router-dom";
import PostList from "../../components/post/PostList";
import SearchBar from "../../components/search/SearchBar";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function ExplorePage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800"
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg"
                        >
                            <Compass className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            Explore
                        </h1>
                    </div>
                    
                    <SearchBar
                        width="100%"
                        onUserSelect={(user) => {
                            navigate(`/profile/${user.username}`);
                        }}
                        onPostSelect={(post) => {
                            navigate(`/posts/${post.id}`);
                        }}
                        onSearchSubmit={(query) => {
                            navigate(`/search?q=${encodeURIComponent(query)}`);
                        }}
                    />
                </div>
            </motion.div>

            {/* Posts Feed */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-3xl mx-auto px-4 sm:px-6 py-6"
            >
                <PostList />
            </motion.div>
        </div>
    );
}
