import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PostDisplay from "../../features/post/postDisplay";
import useInfinitePosts from "../../hooks/useInfinitePosts.jsx";

export default function PostList({ username }) {
    //----------------------------------------
    // Infinite Query
    //----------------------------------------

    const {
        posts,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePosts({
        ...(username && { username }),
    });

    //----------------------------------------
    // Intersection Observer
    //----------------------------------------

    const loadMoreRef = useRef(null);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];

                if (
                    firstEntry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    console.log("Loading next posts page...");
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        observer.observe(element);

        return () => {
            console.log("Disconnecting post observer");
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    //----------------------------------------
    // Debug
    //----------------------------------------

    useEffect(() => {
        console.log("Posts updated:", posts);
    }, [posts]);

    //----------------------------------------
    // Initial Loading
    //----------------------------------------

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
                {[1, 2, 3].map((item) => (
                    <PostSkeleton key={item} />
                ))}
            </div>
        );
    }

    //----------------------------------------
    // Error
    //----------------------------------------

    if (isError) {
        console.error("Failed loading posts:", error);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Failed to load posts.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Please try again later.</p>
            </motion.div>
        );
    }

    //----------------------------------------
    // Empty
    //----------------------------------------

    if (!posts || posts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">No posts available.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Check back later for new content.</p>
            </motion.div>
        );
    }

    //----------------------------------------
    // Render
    //----------------------------------------

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <PostDisplay post={post} />
                </motion.div>
            ))}

            {/* Invisible trigger element for infinite scroll */}
            <div
                ref={loadMoreRef}
                className="h-20 flex justify-center items-center"
            >
                {isFetchingNextPage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                    >
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-medium">Loading more posts...</span>
                    </motion.div>
                )}

                {!hasNextPage && posts.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-500 dark:text-gray-400 font-medium"
                    >
                        You're all caught up! No more posts.
                    </motion.p>
                )}
            </div>
        </div>
    );
}

//----------------------------------------
// Skeleton Component
//----------------------------------------

function PostSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="flex gap-4">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
            </div>
        </motion.div>
    );
}
